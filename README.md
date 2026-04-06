# Doctor Appointment Booking System - Phase 2

This project is rebuilt as a **separate frontend and backend** application to match the Phase 2 rubric while staying aligned with the Phase 1 design.

## Project Structure

- `backend/` Flask REST API + PostgreSQL-ready database
- `frontend/` Separate client built with HTML, CSS, and JavaScript
- `docs/` Postman collection

## Main Features

- Patient registration and login
- Doctor listing by specialization and availability
- Appointment booking and appointment tracking
- Admin dashboard for doctor and appointment monitoring
- JWT authentication, password hashing, and input validation

## Backend Setup

1. Open terminal in `backend`
2. Create virtual environment:
   - `python -m venv venv`
3. Activate it:
   - PowerShell: `venv\Scripts\Activate.ps1`
4. Install packages:
   - `pip install -r requirements.txt`
5. Copy `.env.example` to `.env`
6. Set your PostgreSQL connection in `.env`
7. Create database in PostgreSQL:
   - `CREATE DATABASE doctor_booking_db;`
8. Seed the database:
   - `python seed.py`
9. Run backend:
   - `python app.py`

Backend URL:
- `http://127.0.0.1:5000`

Demo admin login:
- Email: `admin@clinic.com`
- Password: `Admin123`

## Frontend Setup

Open another terminal in `frontend` and run a static server.

### Option 1: VS Code Live Server
- Right click `index.html`
- Open with Live Server

### Option 2: Python simple server
- `python -m http.server 5500`

Frontend URL:
- `http://127.0.0.1:5500`

## Notes

- The frontend uses `frontend/js/config.js` to point to the backend API.
- Default API base URL is `http://127.0.0.1:5000/api`
- If PostgreSQL is not configured yet, the backend falls back to SQLite for quick testing, but Phase 2 should use PostgreSQL for rubric compliance.
