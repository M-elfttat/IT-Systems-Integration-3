from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.models import DoctorProfile, User
from app.utils import role_required

doctors_bp = Blueprint("doctors", __name__)


@doctors_bp.get("")
@jwt_required(optional=True)
def list_doctors():
    specialization = request.args.get("specialization")
    query = DoctorProfile.query.join(User, DoctorProfile.doctor_id == User.id).filter(User.is_active.is_(True))
    if specialization:
        query = query.filter(DoctorProfile.specialization.ilike(f"%{specialization}%"))

    doctors = query.all()
    return jsonify(
        [
            {
                "doctor_id": profile.doctor.id,
                "full_name": profile.doctor.full_name,
                "email": profile.doctor.email,
                "specialization": profile.specialization,
                "experience_years": profile.experience_years,
                "clinic_name": profile.clinic_name,
                "consultation_fee": float(profile.consultation_fee),
                "availability_note": profile.availability_note,
                "bio": profile.bio,
            }
            for profile in doctors
        ]
    )


@doctors_bp.get("/<int:doctor_id>")
@jwt_required(optional=True)
def doctor_profile(doctor_id):
    doctor = User.query.filter_by(id=doctor_id, role="doctor", is_active=True).first_or_404()
    profile = doctor.doctor_profile
    if not profile:
        return jsonify({"message": "Doctor profile not found"}), 404

    return jsonify(
        {
            "doctor_id": doctor.id,
            "full_name": doctor.full_name,
            "specialization": profile.specialization,
            "clinic_name": profile.clinic_name,
            "experience_years": profile.experience_years,
            "consultation_fee": float(profile.consultation_fee),
            "availability_note": profile.availability_note,
            "bio": profile.bio,
        }
    )


@doctors_bp.post("/profile")
@role_required("admin")
def upsert_doctor_profile():
    data = request.get_json() or {}
    doctor_id = data.get("doctor_id")
    if not doctor_id:
        return jsonify({"message": "doctor_id is required"}), 400

    doctor = User.query.filter_by(id=doctor_id, role="doctor").first()
    if not doctor:
        return jsonify({"message": "Doctor user not found"}), 404

    profile = DoctorProfile.query.filter_by(doctor_id=doctor_id).first()
    if profile is None:
        profile = DoctorProfile(doctor_id=doctor_id)

    profile.specialization = data.get("specialization", profile.specialization)
    profile.experience_years = data.get("experience_years", profile.experience_years or 0)
    profile.clinic_name = data.get("clinic_name", profile.clinic_name or "")
    profile.consultation_fee = data.get("consultation_fee", profile.consultation_fee or 0)
    profile.availability_note = data.get("availability_note", profile.availability_note)
    profile.bio = data.get("bio", profile.bio)

    if profile.id is None:
        from app.extensions import db

        db.session.add(profile)
    from app.extensions import db

    db.session.commit()
    return jsonify({"message": "Doctor profile saved"}), 200


@doctors_bp.get("/me/appointments")
@role_required("doctor")
def my_doctor_appointments():
    doctor_id = int(get_jwt_identity())
    rows = (
        User.query.get_or_404(doctor_id)
        .doctor_appointments
    )
    return jsonify(
        [
            {
                "appointment_id": row.id,
                "patient_id": row.patient_id,
                "patient_name": row.patient.full_name,
                "date": row.appointment_date.isoformat(),
                "time": row.appointment_time.isoformat(),
                "status": row.status,
                "symptoms_notes": row.symptoms_notes,
            }
            for row in rows
        ]
    )


@doctors_bp.get("/me/patients")
@role_required("doctor")
def my_doctor_patients():
    doctor_id = int(get_jwt_identity())
    appointments = User.query.get_or_404(doctor_id).doctor_appointments
    seen = {}
    for row in appointments:
        seen[row.patient_id] = {
            "patient_id": row.patient.id,
            "full_name": row.patient.full_name,
            "email": row.patient.email,
            "phone": row.patient.phone,
        }
    return jsonify(list(seen.values()))
