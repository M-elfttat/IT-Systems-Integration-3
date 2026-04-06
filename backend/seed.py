from app import create_app
from extensions import db, bcrypt
from models import Admin, Doctor


def seed_data():
    app = create_app()
    with app.app_context():
        db.create_all()

        if not Admin.query.filter_by(email="admin@clinic.com").first():
            admin = Admin(
                username="admin",
                email="admin@clinic.com",
                password_hash=bcrypt.generate_password_hash("Admin123").decode("utf-8"),
            )
            db.session.add(admin)

        if Doctor.query.count() == 0:
            doctors = [
                Doctor(full_name="Dr. Sarah Ali", specialization="Cardiology", availability="Sun-Thu, 9:00 AM - 1:00 PM", email="sarah.ali@clinic.com", phone="+974 5000 1001"),
                Doctor(full_name="Dr. Omar Hassan", specialization="Dermatology", availability="Sun-Thu, 2:00 PM - 6:00 PM", email="omar.hassan@clinic.com", phone="+974 5000 1002"),
                Doctor(full_name="Dr. Noor Rahman", specialization="Pediatrics", availability="Mon-Thu, 8:00 AM - 12:00 PM", email="noor.rahman@clinic.com", phone="+974 5000 1003"),
            ]
            db.session.add_all(doctors)

        db.session.commit()
        print("Seed data inserted successfully.")
        print("Admin login: admin@clinic.com / Admin123")


if __name__ == "__main__":
    seed_data()
