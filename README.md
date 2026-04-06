# Phase 2 - Doctor Appointment Booking System

This project is a Phase 2 implementation for the **Doctor Appointment Booking System** based on the user's Phase 1 design. It includes a working Flask application, PostgreSQL-ready schema, authentication, doctor listing, appointment booking, appointment tracking, admin management, and a Postman collection for endpoint testing.

## What is included
- Flask backend with REST APIs
- JWT authentication
- Password hashing with bcrypt
- Input validation using Marshmallow
- PostgreSQL schema (`backend/schema.sql`)
- Seed script for demo data
- Frontend pages that follow the same Phase 1 structure:
  - Login / Register
  - Patient Dashboard
  - Doctor List
  - Appointment Booking
  - Admin Dashboard
- Postman collection in `docs/Doctor_Appointment_Booking_Postman_Collection.json`

## Project structure
```text
phase2_app/
├── backend/
│   ├── app.py
│   ├── auth.py
│   ├── doctors.py
│   ├── appointments.py
│   ├── admin.py
│   ├── models.py
│   ├── schemas.py
│   ├── decorators.py
│   ├── config.py
│   ├── extensions.py
│   ├── utils.py
│   ├── seed.py
│   ├── schema.sql
│   ├── requirements.txt
│   ├── .env.example
│   ├── static/
│   └── templates/
└── docs/
    └── Doctor_Appointment_Booking_Postman_Collection.json
```

## Requirements
- Python 3.10+
- PostgreSQL 14+ recommended

## Setup steps
### 1. Create a virtual environment
```bash
cd backend
python -m venv venv
```

### 2. Activate it
#### Windows PowerShell
```bash
venv\Scripts\Activate.ps1
```

#### Windows CMD
```bash
venv\Scripts\activate.bat
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Create PostgreSQL database
Open PostgreSQL and create a database:
```sql
CREATE DATABASE doctor_booking_db;
```

### 5. Add environment variables
Copy `.env.example` to `.env` and update values if needed.

Example:
```env
SECRET_KEY=change-me-in-production
JWT_SECRET_KEY=change-me-too
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/doctor_booking_db
```

### 6. Create tables
Option A: let Flask create the tables automatically when it starts.

Option B: run the PostgreSQL schema manually:
```bash
psql -U postgres -d doctor_booking_db -f schema.sql
```

### 7. Seed demo data
```bash
python seed.py
```
This creates:
- admin user: `admin@clinic.com`
- admin password: `Admin123`
- sample doctors

### 8. Run the application
```bash
python app.py
```

Open:
- `http://127.0.0.1:5000/`

## Main features
### Patient
- Register account
- Login
- View doctor list
- Book appointment
- Track own appointments

### Admin
- Login
- View dashboard summary
- Add doctors
- Monitor appointments

## Security implemented
- JWT authentication for protected routes
- Password hashing with bcrypt
- Input validation using Marshmallow
- Role-based access control for admin-only endpoints

## Main API endpoints
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Doctors
- `GET /api/doctors`
- `GET /api/doctors/<id>`

### Appointments
- `POST /api/appointments`
- `GET /api/appointments`

### Admin
- `GET /api/admin/dashboard`
- `POST /api/admin/doctors`
- `PUT /api/admin/doctors/<id>`
- `DELETE /api/admin/doctors/<id>`
- `GET /api/admin/appointments`
- `PUT /api/admin/appointments/<id>/status`

## Notes
- The app is **PostgreSQL-ready** and includes a PostgreSQL schema to match the ER design.
- For easier first-run testing, the config also falls back to SQLite if `DATABASE_URL` is not set. For the rubric, use PostgreSQL.
- Postman screenshots are not included because they must be taken from your own running environment after testing.
