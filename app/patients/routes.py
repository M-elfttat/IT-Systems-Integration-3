from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity

from app.extensions import db
from app.models import ActivityLog, Appointment, User
from app.utils import role_required

patients_bp = Blueprint("patients", __name__)


@patients_bp.get("/dashboard")
@role_required("patient")
def patient_dashboard():
    patient_id = int(get_jwt_identity())
    appointments = Appointment.query.filter_by(patient_id=patient_id).all()

    upcoming = [a for a in appointments if a.status in ("pending", "approved")]
    completed = [a for a in appointments if a.status == "completed"]
    cancelled = [a for a in appointments if a.status == "cancelled"]

    return jsonify(
        {
            "upcoming_count": len(upcoming),
            "completed_count": len(completed),
            "cancelled_count": len(cancelled),
            "latest_upcoming": [
                {
                    "appointment_id": a.id,
                    "doctor_id": a.doctor_id,
                    "date": a.appointment_date.isoformat(),
                    "time": a.appointment_time.isoformat(),
                    "status": a.status,
                }
                for a in sorted(upcoming, key=lambda x: (x.appointment_date, x.appointment_time))[:5]
            ],
        }
    )


@patients_bp.post("/appointments")
@role_required("patient")
def create_appointment():
    patient_id = int(get_jwt_identity())
    data = request.get_json() or {}

    required = ["doctor_id", "appointment_date", "appointment_time"]
    missing = [field for field in required if not data.get(field)]
    if missing:
        return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

    doctor = User.query.filter_by(id=data["doctor_id"], role="doctor", is_active=True).first()
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404

    try:
        appt_date = datetime.strptime(data["appointment_date"], "%Y-%m-%d").date()
        appt_time = datetime.strptime(data["appointment_time"], "%H:%M").time()
    except ValueError:
        return jsonify({"message": "Invalid date/time format. Use YYYY-MM-DD and HH:MM"}), 400

    exists = Appointment.query.filter_by(
        doctor_id=doctor.id,
        appointment_date=appt_date,
        appointment_time=appt_time,
    ).first()
    if exists:
        return jsonify({"message": "Selected time slot is unavailable"}), 409

    appointment = Appointment(
        patient_id=patient_id,
        doctor_id=doctor.id,
        appointment_date=appt_date,
        appointment_time=appt_time,
        symptoms_notes=data.get("symptoms_notes"),
        status="pending",
    )
    db.session.add(appointment)
    db.session.flush()
    db.session.add(
        ActivityLog(
            actor_user_id=patient_id,
            action="create_appointment",
            entity_type="appointment",
            entity_id=str(appointment.id),
            details=f"Booked appointment with Dr. {doctor.full_name}",
        )
    )
    db.session.commit()

    return jsonify({"message": "Appointment created", "appointment_id": appointment.id}), 201


@patients_bp.get("/appointments")
@role_required("patient")
def my_appointments():
    patient_id = int(get_jwt_identity())
    status = request.args.get("status")
    query = Appointment.query.filter_by(patient_id=patient_id)
    if status:
        query = query.filter_by(status=status)

    rows = query.order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc()).all()
    return jsonify(
        [
            {
                "appointment_id": row.id,
                "doctor_id": row.doctor_id,
                "doctor_name": row.doctor.full_name,
                "date": row.appointment_date.isoformat(),
                "time": row.appointment_time.isoformat(),
                "status": row.status,
                "symptoms_notes": row.symptoms_notes,
            }
            for row in rows
        ]
    )


@patients_bp.patch("/appointments/<int:appointment_id>")
@role_required("patient")
def update_my_appointment(appointment_id):
    patient_id = int(get_jwt_identity())
    appointment = Appointment.query.filter_by(id=appointment_id, patient_id=patient_id).first_or_404()
    data = request.get_json() or {}

    appointment_starts_at = datetime.combine(appointment.appointment_date, appointment.appointment_time)
    two_hours_from_now = datetime.now() + timedelta(hours=2)

    if data.get("status") in ("cancelled",):
        if appointment_starts_at <= two_hours_from_now:
            return jsonify({"message": "You can cancel only up to 2 hours before the appointment time"}), 400
        appointment.status = data["status"]
        db.session.add(
            ActivityLog(
                actor_user_id=patient_id,
                action="cancel_appointment",
                entity_type="appointment",
                entity_id=str(appointment.id),
                details="Patient cancelled appointment",
            )
        )

    if data.get("appointment_date") and data.get("appointment_time"):
        try:
            new_date = datetime.strptime(data["appointment_date"], "%Y-%m-%d").date()
            new_time = datetime.strptime(data["appointment_time"], "%H:%M").time()
        except ValueError:
            return jsonify({"message": "Invalid date/time format"}), 400

        if appointment_starts_at <= two_hours_from_now:
            return jsonify({"message": "You can reschedule only up to 2 hours before the appointment time"}), 400

        exists = Appointment.query.filter(
            Appointment.doctor_id == appointment.doctor_id,
            Appointment.appointment_date == new_date,
            Appointment.appointment_time == new_time,
            Appointment.id != appointment.id,
        ).first()
        if exists:
            return jsonify({"message": "Selected time slot is unavailable"}), 409

        appointment.appointment_date = new_date
        appointment.appointment_time = new_time
        db.session.add(
            ActivityLog(
                actor_user_id=patient_id,
                action="reschedule_appointment",
                entity_type="appointment",
                entity_id=str(appointment.id),
                details=f"Patient rescheduled to {new_date.isoformat()} {new_time.isoformat()}",
            )
        )

    appointment.symptoms_notes = data.get("symptoms_notes", appointment.symptoms_notes)
    db.session.commit()
    return jsonify({"message": "Appointment updated"})
