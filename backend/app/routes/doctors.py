from __future__ import annotations

from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from app import db
from app.models import DoctorProfile, Role, User
from app.security import hash_password
from app.utils import json_error, require_roles

doctors_bp = Blueprint("doctors", __name__)


@doctors_bp.get("")
@jwt_required(optional=True)
def list_doctors():
    specialization = (request.args.get("specialization") or "").strip()

    q = DoctorProfile.query.join(User).filter(DoctorProfile.is_active.is_(True), User.role == Role.DOCTOR.value)
    if specialization:
        q = q.filter(DoctorProfile.specialization.ilike(f"%{specialization}%"))

    doctors = q.order_by(User.full_name.asc()).all()
    return {
        "data": [
            {
                "doctor_id": d.user.id,
                "full_name": d.user.full_name,
                "specialization": d.specialization,
                "clinic": d.clinic,
                "is_active": d.is_active,
            }
            for d in doctors
        ]
    }


@doctors_bp.get("/<int:doctor_id>")
@jwt_required(optional=True)
def get_doctor(doctor_id: int):
    prof = DoctorProfile.query.join(User).filter(User.id == doctor_id, User.role == Role.DOCTOR.value).first()
    if not prof:
        return json_error("NOT_FOUND", "Doctor not found.", 404)
    return {
        "data": {
            "doctor_id": prof.user.id,
            "full_name": prof.user.full_name,
            "specialization": prof.specialization,
            "clinic": prof.clinic,
            "is_active": prof.is_active,
        }
    }


@doctors_bp.post("")
@jwt_required()
@require_roles(Role.ADMIN.value)
def create_doctor():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    full_name = (data.get("full_name") or "").strip()
    specialization = (data.get("specialization") or "").strip()
    clinic = (data.get("clinic") or "").strip() or None

    if not email or "@" not in email:
        return json_error("VALIDATION_ERROR", "Invalid email.", 400)
    if len(password) < 6:
        return json_error("VALIDATION_ERROR", "Password must be at least 6 characters.", 400)
    if not full_name:
        return json_error("VALIDATION_ERROR", "Full name is required.", 400)
    if not specialization:
        return json_error("VALIDATION_ERROR", "Specialization is required.", 400)
    if User.query.filter_by(email=email).first():
        return json_error("CONFLICT", "Email already exists.", 409)

    user = User(email=email, password_hash=hash_password(password), role=Role.DOCTOR.value, full_name=full_name)
    db.session.add(user)
    db.session.flush()
    prof = DoctorProfile(user_id=user.id, specialization=specialization, clinic=clinic, is_active=True)
    db.session.add(prof)
    db.session.commit()

    return {
        "data": {
            "doctor_id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "specialization": prof.specialization,
            "clinic": prof.clinic,
        }
    }, 201


@doctors_bp.patch("/<int:doctor_id>/status")
@jwt_required()
@require_roles(Role.ADMIN.value)
def set_doctor_status(doctor_id: int):
    data = request.get_json(silent=True) or {}
    is_active = data.get("is_active")
    if not isinstance(is_active, bool):
        return json_error("VALIDATION_ERROR", "is_active must be boolean.", 400)

    prof = DoctorProfile.query.join(User).filter(User.id == doctor_id, User.role == Role.DOCTOR.value).first()
    if not prof:
        return json_error("NOT_FOUND", "Doctor not found.", 404)

    prof.is_active = is_active
    db.session.commit()
    return {"data": {"doctor_id": doctor_id, "is_active": prof.is_active}}

