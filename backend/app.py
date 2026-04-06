from flask import Flask, render_template
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
    cors.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(doctors_bp)
    app.register_blueprint(appointments_bp)
    app.register_blueprint(admin_bp)

    @app.get("/")
    def home():
        return render_template("login.html")

    @app.get("/dashboard")
    def dashboard_page():
        return render_template("dashboard.html")

    @app.get("/doctors-page")
    def doctors_page():
        return render_template("doctors.html")

    @app.get("/book")
    def booking_page():
        return render_template("book.html")

    @app.get("/admin-page")
    def admin_page():
        return render_template("admin.html")

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)
