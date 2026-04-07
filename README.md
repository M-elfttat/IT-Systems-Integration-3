# Doctor Appointment Booking System

Flask + PostgreSQL project scaffold for a rubric-based university system with:
- Functional frontend client (`templates/index.html`, `static/app.js`, `static/styles.css`)
- Secure API integration with JWT token auth
- Structured Flask blueprints for auth, patient, doctor, admin, and payments
- PostgreSQL schema with constraints matching ER-style entities
- Postman testing collection

## Tech Stack
- Flask REST APIs
- PostgreSQL
- SQLAlchemy + Flask-Migrate
- JWT token authentication

## Quick Setup
1. Create PostgreSQL database:
   - DB name: `doctor_appointment_db`
   - Username: `postgres`
   - Password: `infs3202`
2. Copy `.env.example` to `.env`.
3. Install dependencies:
   - `pip install -r requirements.txt`
4. Run migrations:
   - `flask --app run.py db init`
   - `flask --app run.py db migrate -m "initial schema"`
   - `flask --app run.py db upgrade`
5. Start app:
   - `python run.py`
6. Open:
   - `http://127.0.0.1:5000`

## API Route Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Doctors
- `GET /api/doctors`
- `GET /api/doctors/<doctor_id>`
- `POST /api/doctors/profile`

### Patients
- `GET /api/patients/dashboard`
- `POST /api/patients/appointments`
- `GET /api/patients/appointments`
- `PATCH /api/patients/appointments/<appointment_id>`

### Payments
- `POST /api/payments`
- `GET /api/payments/<appointment_id>`

### Admin
- `GET /api/admin/dashboard`
- `POST /api/admin/doctors`
- `GET /api/admin/appointments`
- `PATCH /api/admin/appointments/<appointment_id>`

## Security Implemented
- Password hashing (`werkzeug.security`)
- JWT-based auth + role-based authorization (`patient`, `doctor`, `admin`)
- Secure response headers (`X-Frame-Options`, `X-Content-Type-Options`, `Cache-Control`, `Referrer-Policy`)
- Input validation and safe ORM usage

## Postman Testing
- Import `postman/doctor-appointment.postman_collection.json`
- Set `base_url` to `http://127.0.0.1:5000`
- Set `patient_token` and `admin_token` after login requests

## Rubric Coverage
- Frontend/client with secure token-based API calls: done
- Flask API structure and HTTP/JSON handling: done
- Postman endpoint testing pack: done
- PostgreSQL schema + constraints: done
- Two security measures (JWT + hashed passwords + headers): done
