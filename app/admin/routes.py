from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity

from app.extensions import db
from app.models import ActivityLog, Appointment, DoctorProfile, Payment, User
from app.utils import role_required

admin_bp = Blueprint("admin", __name__)


def log_activity(action, entity_type, entity_id=None, details=None):
    actor_id = int(get_jwt_identity())
    db.session.add(
        ActivityLog(
            actor_user_id=actor_id,
            action=action,
            entity_type=entity_type,
            entity_id=str(entity_id) if entity_id is not None else None,
            details=details,
        )
    )


@admin_bp.get("/dashboard")
@role_required("admin")
def admin_dashboard():
    patients = User.query.filter_by(role="patient").count()
    doctors = User.query.filter_by(role="doctor").count()
    appointments = Appointment.query.count()
    pending = Appointment.query.filter_by(status="pending").count()
    return jsonify(
        {
            "total_patients": patients,
            "total_doctors": doctors,
            "total_appointments": appointments,
            "pending_appointments": pending,
        }
    )


@admin_bp.post("/doctors")
@role_required("admin")
def add_doctor():
    data = request.get_json() or {}
    required = [
        "full_name",
        "email",
        "phone",
        "password",
        "specialization",
        "experience_years",
        "clinic_name",
        "consultation_fee",
    ]
    missing = [field for field in required if not data.get(field)]
    if missing:
        return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

    if User.query.filter((User.email == data["email"]) | (User.phone == data["phone"])).first():
        return jsonify({"message": "Email or phone already exists"}), 409

    doctor = User(
        full_name=data["full_name"],
        email=data["email"].lower().strip(),
        phone=data["phone"].strip(),
        role="doctor",
    )
    doctor.set_password(data["password"])
    db.session.add(doctor)
    db.session.flush()

    profile = DoctorProfile(
        doctor_id=doctor.id,
        specialization=data["specialization"],
        experience_years=data["experience_years"],
        clinic_name=data["clinic_name"],
        consultation_fee=data["consultation_fee"],
        bio=data.get("bio"),
        availability_note=data.get("availability_note"),
    )
    db.session.add(profile)
    log_activity("create_doctor", "doctor", doctor.id, f"Created doctor {doctor.full_name}")
    db.session.commit()

    return jsonify({"message": "Doctor created", "doctor_id": doctor.id}), 201


@admin_bp.get("/appointments")
@role_required("admin")
def get_all_appointments():
    status = request.args.get("status")
    query = Appointment.query
    if status:
        query = query.filter_by(status=status)
    rows = query.order_by(Appointment.appointment_date.desc()).all()
    return jsonify(
        [
            {
                "appointment_id": row.id,
                "patient_id": row.patient_id,
                "patient_name": row.patient.full_name,
                "doctor_id": row.doctor_id,
                "doctor_name": row.doctor.full_name,
                "date": row.appointment_date.isoformat(),
                "time": row.appointment_time.isoformat(),
                "status": row.status,
            }
            for row in rows
        ]
    )


@admin_bp.patch("/appointments/<int:appointment_id>")
@role_required("admin")
def update_appointment_status(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    data = request.get_json() or {}
    new_status = data.get("status")
    if new_status not in ("pending", "approved", "completed", "cancelled"):
        return jsonify({"message": "Invalid status"}), 400
    appointment.status = new_status
    log_activity(
        "update_appointment_status",
        "appointment",
        appointment.id,
        f"{appointment.patient.full_name} with Dr. {appointment.doctor.full_name} set to {new_status}",
    )
    db.session.commit()
    return jsonify({"message": "Appointment status updated"})


@admin_bp.get("/patients")
@role_required("admin")
def get_all_patients():
    rows = User.query.filter_by(role="patient").order_by(User.created_at.desc()).all()
    return jsonify(
        [
            {
                "patient_id": row.id,
                "full_name": row.full_name,
                "email": row.email,
                "phone": row.phone,
                "is_active": row.is_active,
                "created_at": row.created_at.isoformat(),
            }
            for row in rows
        ]
    )


@admin_bp.get("/payments")
@role_required("admin")
def get_all_payments():
    rows = Payment.query.order_by(Payment.created_at.desc()).all()
    return jsonify(
        [
            {
                "payment_id": row.id,
                "appointment_id": row.appointment_id,
                "patient_name": row.appointment.patient.full_name if row.appointment else None,
                "doctor_name": row.appointment.doctor.full_name if row.appointment else None,
                "amount": float(row.amount),
                "method": row.method,
                "status": row.status,
                "transaction_ref": row.transaction_ref,
                "created_at": row.created_at.isoformat(),
            }
            for row in rows
        ]
    )


@admin_bp.get("/activity")
@role_required("admin")
def get_activity_log():
    rows = ActivityLog.query.order_by(ActivityLog.created_at.desc()).limit(200).all()
    return jsonify(
        [
            {
                "id": row.id,
                "actor_user_id": row.actor_user_id,
                "actor_name": User.query.get(row.actor_user_id).full_name if row.actor_user_id else "System",
                "action": row.action,
                "entity_type": row.entity_type,
                "entity_id": row.entity_id,
                "details": row.details,
                "created_at": row.created_at.isoformat(),
            }
            for row in rows
        ]
    )
