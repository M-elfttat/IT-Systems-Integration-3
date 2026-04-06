from __future__ import annotations

from datetime import datetime

from flask import Blueprint, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from sqlalchemy.exc import IntegrityError

from app import db
from app.models import Appointment, AppointmentStatus, DoctorProfile, Role, User
from app.utils import json_error, require_roles

appointments_bp = Blueprint("appointments", __name__)


def _parse_iso_datetime(value: str) -> datetime | None:
    try:
        # Accept "YYYY-MM-DDTHH:MM:SS" or "...Z" (treated as UTC but stored naive here for simplicity)
        v = value.strip()
        if v.endswith("Z"):
            v = v[:-1]
        return datetime.fromisoformat(v)
    except Exception:
        return None


@appointments_bp.post("")
@jwt_required()
@require_roles(Role.PATIENT.value)
def create_appointment():
    data = request.get_json(silent=True) or {}
    doctor_id = data.get("doctor_id")
    start_time_raw = data.get("start_time") or ""

    if not isinstance(doctor_id, int):
        return json_error("VALIDATION_ERROR", "doctor_id must be an integer.", 400)

    start_time = _parse_iso_datetime(start_time_raw)
    if not start_time:
        return json_error("VALIDATION_ERROR", "start_time must be ISO datetime string.", 400)

    doctor = User.query.filter_by(id=doctor_id, role=Role.DOCTOR.value).first()
    if not doctor or not doctor.doctor_profile or not doctor.doctor_profile.is_active:
        return json_error("NOT_FOUND", "Doctor not found or inactive.", 404)

    patient_id = int(get_jwt_identity())

    appt = Appointment(patient_id=patient_id, doctor_id=doctor_id, start_time=start_time)
    db.session.add(appt)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return json_error("CONFLICT", "This time slot is already booked for this doctor.", 409)

    return {
        "data": {
            "appointment_id": appt.id,
            "doctor_id": appt.doctor_id,
            "patient_id": appt.patient_id,
            "start_time": appt.start_time.isoformat(),
            "status": appt.status,
        }
    }, 201


@appointments_bp.get("/me")
@jwt_required()
@require_roles(Role.PATIENT.value)
def my_appointments():
    patient_id = int(get_jwt_identity())
    appts = (
        Appointment.query.filter_by(patient_id=patient_id)
        .order_by(Appointment.start_time.desc())
        .limit(200)
        .all()
    )

    # prefetch doctors
    doctor_ids = {a.doctor_id for a in appts}
    doctors = {u.id: u for u in User.query.filter(User.id.in_(doctor_ids)).all()} if doctor_ids else {}
    profiles = {
        p.user_id: p for p in DoctorProfile.query.filter(DoctorProfile.user_id.in_(doctor_ids)).all()
    } if doctor_ids else {}

    return {
        "data": [
            {
                "appointment_id": a.id,
                "start_time": a.start_time.isoformat(),
                "status": a.status,
                "doctor": {
                    "doctor_id": a.doctor_id,
                    "full_name": doctors.get(a.doctor_id).full_name if doctors.get(a.doctor_id) else None,
                    "specialization": profiles.get(a.doctor_id).specialization if profiles.get(a.doctor_id) else None,
                },
            }
            for a in appts
        ]
    }


@appointments_bp.get("/doctor/me")
@jwt_required()
@require_roles(Role.DOCTOR.value)
def doctor_schedule():
    doctor_id = int(get_jwt_identity())
    appts = (
        Appointment.query.filter_by(doctor_id=doctor_id)
        .order_by(Appointment.start_time.desc())
        .limit(200)
        .all()
    )

    patient_ids = {a.patient_id for a in appts}
    patients = {u.id: u for u in User.query.filter(User.id.in_(patient_ids)).all()} if patient_ids else {}

    return {
        "data": [
            {
                "appointment_id": a.id,
                "start_time": a.start_time.isoformat(),
                "status": a.status,
                "patient": {
                    "patient_id": a.patient_id,
                    "full_name": patients.get(a.patient_id).full_name if patients.get(a.patient_id) else None,
                },
            }
            for a in appts
        ]
    }


@appointments_bp.patch("/<int:appointment_id>")
@jwt_required()
def update_appointment(appointment_id: int):
    data = request.get_json(silent=True) or {}
    new_status = (data.get("status") or "").strip().upper()
    if new_status not in {s.value for s in AppointmentStatus}:
        return json_error("VALIDATION_ERROR", "Invalid status.", 400)

    appt = Appointment.query.get(appointment_id)
    if not appt:
        return json_error("NOT_FOUND", "Appointment not found.", 404)

    role = (get_jwt().get("role") or "").upper()
    user_id = int(get_jwt_identity())

    # Patient can only cancel their own
    if role == Role.PATIENT.value:
        if appt.patient_id != user_id:
            return json_error("FORBIDDEN", "Not your appointment.", 403)
        if new_status != AppointmentStatus.CANCELLED.value:
            return json_error("FORBIDDEN", "Patients can only cancel appointments.", 403)

    # Doctor can update status of their own appointments
    if role == Role.DOCTOR.value:
        if appt.doctor_id != user_id:
            return json_error("FORBIDDEN", "Not your appointment.", 403)

    # Admin can update any
    if role not in {Role.PATIENT.value, Role.DOCTOR.value, Role.ADMIN.value}:
        return json_error("FORBIDDEN", "Invalid role.", 403)

    appt.status = new_status
    db.session.commit()
    return {"data": {"appointment_id": appt.id, "status": appt.status}}

