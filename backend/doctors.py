from flask import Blueprint, jsonify
from models import Doctor


doctors_bp = Blueprint("doctors", __name__, url_prefix="/api/doctors")


@doctors_bp.get("")
def list_doctors():
    doctors = Doctor.query.order_by(Doctor.full_name.asc()).all()
    return jsonify([
        {
            "id": doctor.id,
            "full_name": doctor.full_name,
            "specialization": doctor.specialization,
            "availability": doctor.availability,
            "email": doctor.email,
            "phone": doctor.phone,
        }
        for doctor in doctors
    ])


@doctors_bp.get("/<int:doctor_id>")
def get_doctor(doctor_id):
    doctor = Doctor.query.get_or_404(doctor_id)
    return jsonify({
        "id": doctor.id,
        "full_name": doctor.full_name,
        "specialization": doctor.specialization,
        "availability": doctor.availability,
        "email": doctor.email,
        "phone": doctor.phone,
    })
