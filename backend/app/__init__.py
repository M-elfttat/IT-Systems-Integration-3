from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app() -> Flask:
    load_dotenv()
    app = Flask(__name__)

    # Config
    app.config.from_object("app.config.Config")

    # Extensions
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}}, supports_credentials=True)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Routes
    from app.routes.auth import auth_bp
    from app.routes.doctors import doctors_bp
    from app.routes.appointments import appointments_bp

    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
    app.register_blueprint(doctors_bp, url_prefix="/api/v1/doctors")
    app.register_blueprint(appointments_bp, url_prefix="/api/v1/appointments")

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app

