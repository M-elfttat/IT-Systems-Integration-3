from __future__ import annotations

from flask import Blueprint, request
from flask_jwt_extended import create_access_token

from app import db
from app.models import Role, User
from app.security import hash_password, verify_password
from app.utils import json_error

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    full_name = (data.get("full_name") or "").strip()

    if not email or "@" not in email:
        return json_error("VALIDATION_ERROR", "Invalid email.", 400)
    if len(password) < 6:
        return json_error("VALIDATION_ERROR", "Password must be at least 6 characters.", 400)
    if not full_name:
        return json_error("VALIDATION_ERROR", "Full name is required.", 400)

    if User.query.filter_by(email=email).first():
        return json_error("CONFLICT", "Email already registered.", 409)

    user = User(email=email, password_hash=hash_password(password), role=Role.PATIENT.value, full_name=full_name)
    db.session.add(user)
    db.session.commit()

    return {"data": {"id": user.id, "email": user.email, "role": user.role, "full_name": user.full_name}}, 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(password, user.password_hash):
        return json_error("UNAUTHORIZED", "Invalid email or password.", 401)

    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    return {"data": {"access_token": token, "user": {"id": user.id, "email": user.email, "role": user.role}}}

