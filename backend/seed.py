from __future__ import annotations

import os

from app import create_app, db
from app.models import DoctorProfile, Role, User
from app.security import hash_password


def ensure_user(email: str, password: str, full_name: str, role: str) -> User:
    email = email.strip().lower()
    u = User.query.filter_by(email=email).first()
    if u:
        return u
    u = User(email=email, password_hash=hash_password(password), full_name=full_name, role=role)
    db.session.add(u)
    db.session.flush()
    return u


def main() -> None:
    admin_email = os.environ.get("SEED_ADMIN_EMAIL", "admin@sysint.local")
    admin_password = os.environ.get("SEED_ADMIN_PASSWORD", "Admin123!")

    app = create_app()
    with app.app_context():
        admin = ensure_user(admin_email, admin_password, "System Admin", Role.ADMIN.value)

        # 3 sample doctors
        docs = [
            ("sara.cardiology@sysint.local", "Doctor123!", "Dr. Sara Ali", "Cardiology", "City Clinic"),
            ("omar.derma@sysint.local", "Doctor123!", "Dr. Omar Hassan", "Dermatology", "Downtown Medical"),
            ("lina.pedia@sysint.local", "Doctor123!", "Dr. Lina Ahmed", "Pediatrics", "Family Care Center"),
        ]

        for email, pwd, name, spec, clinic in docs:
            du = ensure_user(email, pwd, name, Role.DOCTOR.value)
            prof = DoctorProfile.query.filter_by(user_id=du.id).first()
            if not prof:
                db.session.add(DoctorProfile(user_id=du.id, specialization=spec, clinic=clinic, is_active=True))

        db.session.commit()

        print("Seed complete.")
        print(f"Admin login: {admin_email} / {admin_password}")
        print("Doctor logins: password = Doctor123! for each seeded doctor email")


if __name__ == "__main__":
    main()

