from __future__ import annotations

from datetime import datetime
from enum import Enum

from sqlalchemy import CheckConstraint, UniqueConstraint

from app import db


class Role(str, Enum):
    PATIENT = "PATIENT"
    DOCTOR = "DOCTOR"
    ADMIN = "ADMIN"


class AppointmentStatus(str, Enum):
    SCHEDULED = "SCHEDULED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, index=True)

    full_name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


class DoctorProfile(db.Model):
    __tablename__ = "doctor_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    specialization = db.Column(db.String(120), nullable=False, index=True)
    clinic = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True, index=True)

    user = db.relationship("User", backref=db.backref("doctor_profile", uselist=False))


class Appointment(db.Model):
    __tablename__ = "appointments"
    __table_args__ = (
        UniqueConstraint("doctor_id", "start_time", name="uq_doctor_start_time"),
        CheckConstraint(
            "status IN ('SCHEDULED','COMPLETED','CANCELLED')",
            name="ck_appointment_status",
        ),
    )

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    start_time = db.Column(db.DateTime, nullable=False, index=True)
    status = db.Column(db.String(20), nullable=False, default=AppointmentStatus.SCHEDULED.value, index=True)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    patient = db.relationship("User", foreign_keys=[patient_id])
    doctor = db.relationship("User", foreign_keys=[doctor_id])

