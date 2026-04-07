import os
from datetime import timedelta
from urllib.parse import urlparse

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template
from flask_cors import CORS
import psycopg2

from app.admin.routes import admin_bp
from app.auth.routes import auth_bp
from app.doctors.routes import doctors_bp
from app.extensions import db, jwt, migrate
from app.models import ActivityLog, Appointment, DoctorProfile, Payment, User
from app.patients.routes import patients_bp
from app.payments.routes import payments_bp


def create_app():
    load_dotenv()
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-key")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:infs3202@localhost:5432/appointments",
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "jwt-dev-key")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

    ensure_database_exists(app.config["SQLALCHEMY_DATABASE_URI"])

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    register_security_headers(app)
    register_error_handlers(app)
    register_routes(app)

    # Auto-create tables to avoid missing-model issues during setup/demo.
    with app.app_context():
        db.create_all()

    return app


def ensure_database_exists(database_url):
    parsed = urlparse(database_url)
    db_name = parsed.path.lstrip("/")
    if not db_name:
        return

    conn = psycopg2.connect(
        dbname="postgres",
        user=parsed.username,
        password=parsed.password,
        host=parsed.hostname or "localhost",
        port=parsed.port or 5432,
    )
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
    exists = cur.fetchone()
    if not exists:
        cur.execute(f'CREATE DATABASE "{db_name}"')
    cur.close()
    conn.close()


def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(patients_bp, url_prefix="/api/patients")
    app.register_blueprint(doctors_bp, url_prefix="/api/doctors")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(payments_bp, url_prefix="/api/payments")

    @app.route("/")
    def home():
        return render_template("index.html")

    @app.route("/health")
    def health():
        return jsonify({"status": "ok", "service": "doctor-appointment-api"}), 200


def register_security_headers(app):
    @app.after_request
    def set_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Cache-Control"] = "no-store"
        return response


def register_error_handlers(app):
    @jwt.unauthorized_loader
    def missing_token(_):
        return jsonify({"message": "Missing or invalid Authorization header"}), 401

    @jwt.invalid_token_loader
    def invalid_token(_):
        return jsonify({"message": "Invalid token"}), 401

    @jwt.expired_token_loader
    def expired_token(_jwt_header, _jwt_payload):
        return jsonify({"message": "Token has expired"}), 401

    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"message": "Route not found"}), 404

    @app.errorhandler(500)
    def server_error(_):
        return jsonify({"message": "Internal server error"}), 500
