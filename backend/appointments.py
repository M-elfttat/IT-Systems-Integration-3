from decimal import Decimal
from flask import Blueprint, jsonify, request, g
from marshmallow import ValidationError
from decorators import auth_required
from extensions import db
from models import Appointment, Doctor, Payment
from schemas import AppointmentSchema


appointments_bp = Blueprint("appointments", __name__, url_prefix="/api/appointments")
appointment_schema = AppointmentSchema()


@appointments_bp.post("")
@auth_required(role="patient")
def create_appointment():
    try:
        data = appointment_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    doctor = Doctor.query.get(data["doctor_id"])
    if not doctor:
        return jsonify({"message": "Doctor not found."}), 404

    appointment = Appointment(
        patient_id=g.user_id,
        doctor_id=data["doctor_id"],
        appointment_date=data["appointment_date"],
        appointment_time=data["appointment_time"],
        status="Booked",
        notes=data.get("notes", ""),
    )
    payment = Payment(amount=Decimal("100.00"), payment_status="Pending")
    appointment.payment = payment

    try:
        db.session.add(appointment)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"message": "Selected time slot is already booked for this doctor."}), 409

    return jsonify({"message": "Appointment booked successfully.", "appointment_id": appointment.id}), 201


@appointments_bp.get("")
@auth_required()
def list_appointments():
    query = Appointment.query
    if g.role == "patient":
        query = query.filter_by(patient_id=g.user_id)

    appointments = query.order_by(Appointment.appointment_date.asc(), Appointment.appointment_time.asc()).all()
    return jsonify([
        {
            "id": item.id,
            "patient_id": item.patient_id,
            "patient_name": item.patient.full_name,
            "doctor_id": item.doctor_id,
            "doctor_name": item.doctor.full_name,
            "specialization": item.doctor.specialization,
            "appointment_date": item.appointment_date.isoformat(),
            "appointment_time": item.appointment_time.strftime("%H:%M"),
            "status": item.status,
            "notes": item.notes or "",
            "payment_status": item.payment.payment_status if item.payment else None,
        }
        for item in appointments
    ])
