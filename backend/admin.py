from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from decorators import auth_required
from extensions import db
from models import Appointment, Doctor
from schemas import AppointmentStatusSchema, DoctorSchema


admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")
doctor_schema = DoctorSchema()
status_schema = AppointmentStatusSchema()


@admin_bp.get("/dashboard")
@auth_required(role="admin")
def dashboard_summary():
    return jsonify({
        "total_doctors": Doctor.query.count(),
        "total_appointments": Appointment.query.count(),
        "booked": Appointment.query.filter_by(status="Booked").count(),
        "completed": Appointment.query.filter_by(status="Completed").count(),
        "cancelled": Appointment.query.filter_by(status="Cancelled").count(),
    })


@admin_bp.post("/doctors")
@auth_required(role="admin")
def create_doctor():
    try:
        data = doctor_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    if Doctor.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Doctor email already exists."}), 409

    doctor = Doctor(**data)
    db.session.add(doctor)
    db.session.commit()
    return jsonify({"message": "Doctor created successfully.", "doctor_id": doctor.id}), 201


@admin_bp.put("/doctors/<int:doctor_id>")
@auth_required(role="admin")
def update_doctor(doctor_id):
    doctor = Doctor.query.get_or_404(doctor_id)
    try:
        data = doctor_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    for key, value in data.items():
        setattr(doctor, key, value)
    db.session.commit()
    return jsonify({"message": "Doctor updated successfully."})


@admin_bp.delete("/doctors/<int:doctor_id>")
@auth_required(role="admin")
def delete_doctor(doctor_id):
    doctor = Doctor.query.get_or_404(doctor_id)
    db.session.delete(doctor)
    db.session.commit()
    return jsonify({"message": "Doctor deleted successfully."})


@admin_bp.get("/appointments")
@auth_required(role="admin")
def list_all_appointments():
    appointments = Appointment.query.order_by(Appointment.created_at.desc()).all()
    return jsonify([
        {
            "id": item.id,
            "patient_name": item.patient.full_name,
            "doctor_name": item.doctor.full_name,
            "appointment_date": item.appointment_date.isoformat(),
            "appointment_time": item.appointment_time.strftime("%H:%M"),
            "status": item.status,
            "payment_status": item.payment.payment_status if item.payment else None,
        }
        for item in appointments
    ])


@admin_bp.put("/appointments/<int:appointment_id>/status")
@auth_required(role="admin")
def update_appointment_status(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    try:
        data = status_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    appointment.status = data["status"]
    if appointment.payment and data["status"] == "Completed":
        appointment.payment.payment_status = "Paid"
    db.session.commit()
    return jsonify({"message": "Appointment status updated successfully."})
