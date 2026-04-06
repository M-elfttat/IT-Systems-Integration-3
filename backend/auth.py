from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from extensions import bcrypt, db
from models import Admin, Patient
from schemas import LoginSchema, RegisterSchema
from utils import create_token


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")
register_schema = RegisterSchema()
login_schema = LoginSchema()


@auth_bp.post("/register")
def register():
    try:
        data = register_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    if Patient.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email is already registered."}), 409

    patient = Patient(
        full_name=data["full_name"],
        email=data["email"],
        phone=data["phone"],
        password_hash=bcrypt.generate_password_hash(data["password"]).decode("utf-8"),
    )
    db.session.add(patient)
    db.session.commit()

    token = create_token(patient.id, "patient")
    return jsonify({
        "message": "Registration successful.",
        "token": token,
        "user": {"id": patient.id, "role": "patient", "full_name": patient.full_name, "email": patient.email},
    }), 201


@auth_bp.post("/login")
def login():
    try:
        data = login_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    admin = Admin.query.filter_by(email=data["email"]).first()
    if admin and bcrypt.check_password_hash(admin.password_hash, data["password"]):
        token = create_token(admin.id, "admin")
        return jsonify({
            "message": "Admin login successful.",
            "token": token,
            "user": {"id": admin.id, "role": "admin", "username": admin.username, "email": admin.email},
        })

    patient = Patient.query.filter_by(email=data["email"]).first()
    if patient and bcrypt.check_password_hash(patient.password_hash, data["password"]):
        token = create_token(patient.id, "patient")
        return jsonify({
            "message": "Patient login successful.",
            "token": token,
            "user": {"id": patient.id, "role": "patient", "full_name": patient.full_name, "email": patient.email},
        })

    return jsonify({"message": "Invalid email or password."}), 401
