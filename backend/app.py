from flask import Flask, jsonify
from config import Config
from extensions import bcrypt, cors, db, migrate
from auth import auth_bp
from doctors import doctors_bp
from appointments import appointments_bp
from admin import admin_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": [app.config["FRONTEND_ORIGIN"], "http://localhost:5500", "http://127.0.0.1:5500", "null"]}})

    app.register_blueprint(auth_bp)
    app.register_blueprint(doctors_bp)
    app.register_blueprint(appointments_bp)
    app.register_blueprint(admin_bp)

    @app.get("/")
    def home():
        return jsonify({
            "message": "Doctor Appointment Booking API is running.",
            "frontend": app.config["FRONTEND_ORIGIN"],
        })

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)
