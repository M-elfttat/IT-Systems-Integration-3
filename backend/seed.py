from app import create_app
from extensions import bcrypt, db
from models import Admin, Doctor


def run_seed():
    app = create_app()
    with app.app_context():
        db.create_all()

        if not Admin.query.filter_by(email="admin@clinic.com").first():
            admin = Admin(
                username="System Admin",
                email="admin@clinic.com",
                password_hash=bcrypt.generate_password_hash("Admin123").decode("utf-8"),
            )
            db.session.add(admin)

        doctors = [
            ("Dr. Sara Ahmed", "Cardiology", "Sun-Thu 9:00 AM - 1:00 PM", "sara.ahmed@clinic.com", "+974 5000 0001"),
            ("Dr. Omar Khalid", "Dermatology", "Sun-Thu 2:00 PM - 6:00 PM", "omar.khalid@clinic.com", "+974 5000 0002"),
            ("Dr. Lina Joseph", "Pediatrics", "Mon-Thu 10:00 AM - 3:00 PM", "lina.joseph@clinic.com", "+974 5000 0003"),
        ]
        for full_name, specialization, availability, email, phone in doctors:
            if not Doctor.query.filter_by(email=email).first():
                db.session.add(Doctor(
                    full_name=full_name,
                    specialization=specialization,
                    availability=availability,
                    email=email,
                    phone=phone,
                ))

        db.session.commit()
        print("Seed completed. Admin login: admin@clinic.com / Admin123")


if __name__ == "__main__":
    run_seed()
