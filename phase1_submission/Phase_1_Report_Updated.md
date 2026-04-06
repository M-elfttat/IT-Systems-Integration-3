## INFS3202 – IT Systems Integration
## Phase 1: System Design & Planning
**Project Title:** Doctor Appointment Booking System  
**Target Tech Stack (Phase 2):** React (Client) + Flask (REST API) + PostgreSQL (Database) + JWT Authentication

---

## 1) Project Overview
The **Doctor Appointment Booking System** is a web-based application designed to simplify and secure the process of scheduling medical appointments. The system allows patients to register, log in, view available doctors, and book appointments based on doctor specialization and availability.

Doctors can manage their schedules and update appointment statuses, while administrators manage doctor records and monitor system operations. The solution improves efficiency, reduces scheduling conflicts, and provides a convenient platform for patients and healthcare providers.

---

## 2) Scope & Core Features (Client Requirements)
### Patient
- Register and login
- Browse doctors (search/filter by specialization)
- View doctor details and availability
- Book appointments (date/time)
- View and manage appointments (upcoming/past)
- Cancel appointment with business rules (e.g., cannot cancel within X hours)

### Doctor
- View daily/weekly schedule
- Update appointment status (e.g., Scheduled, Completed, Cancelled)

### Admin
- Create/update/deactivate doctors
- View all appointments
- Monitor appointment statuses and basic usage metrics

---

## 3) UI/UX Wireframes → Final UI Plan (React)
This section defines the UI screens to ensure a **functional client** with clear user flows and demo-ready navigation.

### Public (Unauthenticated)
- **Login / Register**
  - Clear validation messages
  - Friendly error handling (invalid credentials, server errors)
  - Loading states during requests

### Patient
- **Patient Dashboard**
  - Next appointment card + quick actions (Book Appointment, My Appointments)
- **Doctors List**
  - Search + specialization filter chips
  - Doctor cards with “View Details” CTA
- **Doctor Details**
  - Doctor profile + specialization + availability slots
- **Book Appointment**
  - Stepper flow: Choose slot → Confirm → Success
- **My Appointments**
  - Status badges + cancel action (if allowed)

### Doctor
- **Doctor Schedule**
  - List/calendar view + status updates per appointment

### Admin
- **Admin Dashboard**
  - Manage doctors + appointments overview

### UI/UX Standards (Phase 2 Implementation Targets)
- Consistent spacing, typography, and color system
- Loading/skeleton states for lists
- Accessible forms (labels, focus states, keyboard navigation)
- Responsive layout (mobile-friendly)

---

## 4) System Architecture (Client–API–Database)
The system follows a standard **client–server architecture**:
- **React frontend** communicates with backend **Flask REST APIs**
- Flask APIs validate requests, enforce authorization, and perform business logic
- Data is stored in **PostgreSQL** with constraints that prevent invalid bookings and preserve integrity

---

## 5) API & Microservices Design (Flask Services)
### API Conventions
- Base URL: `/api/v1`
- JSON only (`Content-Type: application/json`)
- Standardized responses:
  - Success: `{ "data": ..., "message": "...", "meta": ... }`
  - Error: `{ "error": { "code": "...", "message": "...", "details": ... } }`

### Authentication & Token Flow (Secure API Integration)
- Login returns a **JWT access token**
- Client sends: `Authorization: Bearer <token>`
- Error handling:
  - **401**: token missing/expired → logout + redirect to login
  - **403**: role not allowed → show “Not authorized”
  - **400**: validation errors → show field-level messages
  - **500**: server error → show generic retry message

### Endpoint Plan (Correct HTTP Methods)
#### Auth
- `POST /auth/register` (Create patient account)
- `POST /auth/login` (Issue JWT)

#### Doctors
- `GET /doctors` (List doctors; support specialization filter)
- `GET /doctors/{doctorId}` (Doctor details)
- `POST /doctors` (Admin creates doctor)
- `PATCH /doctors/{doctorId}` (Admin updates doctor)
- `PATCH /doctors/{doctorId}/status` (Admin activate/deactivate)

#### Appointments
- `POST /appointments` (Patient books appointment)
- `GET /appointments/me` (Patient views own appointments)
- `GET /appointments/doctor/me` (Doctor views schedule)
- `PATCH /appointments/{appointmentId}` (Update status/cancel based on role)

---

## 6) Database Design (PostgreSQL) + Constraints
### Entities (ERD Alignment)
- `patients`
- `doctors`
- `appointments`
- `admins`
- `payments` (optional for Phase 2, included if required by ERD)

### Key Integrity Constraints (Enforced in PostgreSQL)
- Primary keys on each table (e.g., `id`)
- Foreign keys:
  - `appointments.patient_id` → `patients.id`
  - `appointments.doctor_id` → `doctors.id`
- Prevent double-booking:
  - Unique constraint on `(doctor_id, start_time)`
- Status enforcement:
  - CHECK constraint limiting allowed values (e.g., `SCHEDULED`, `COMPLETED`, `CANCELLED`)
- Required fields:
  - NOT NULL constraints for mandatory attributes
- Performance:
  - Index on `appointments(doctor_id, start_time)`

---

## 7) Normalization (3NF Summary)
The schema is designed using **Third Normal Form (3NF)**:
- **1NF**: atomic attributes, no repeating groups
- **2NF**: non-key attributes fully depend on the key
- **3NF**: no transitive dependencies; non-key attributes depend only on the primary key

This reduces redundancy and improves consistency.

---

## 8) Security Implementation (Two Measures)
The project will implement at least **two** security measures:
1) **Password hashing** using `bcrypt` (no plaintext passwords)
2) **JWT authentication** with **role-based authorization** (patient/doctor/admin)

Additional planned hardening:
- Input validation on all endpoints
- CORS restricted to the frontend origin
- Rate limiting on authentication endpoints (optional)

---

## 9) API Testing Plan (Postman) + Evidence
### Postman Tests (All Endpoints)
- Register: valid + invalid payloads
- Login: valid + invalid credentials
- Protected access without token → expect **401**
- Book appointment with token → **201**
- Double-book same doctor/time → **409 Conflict**
- Patient “my appointments” → **200**
- Doctor “my schedule” → **200**
- Admin create doctor → **201**

### Authenticated Requests
- Use Postman environment variable: `{{token}}`
- Header: `Authorization: Bearer {{token}}`

### Screenshots (to include in submission)
- Login success (token returned)
- Unauthorized request (401)
- Appointment created (201)
- Double-book prevented (409)
- Admin create doctor (201)

---

## 10) Final Presentation & Live Demo Plan
### Presentation Outline (5–7 minutes)
- Problem + objectives
- Architecture overview (React → Flask → PostgreSQL)
- UI walkthrough (patient booking flow)
- API demo using Postman (auth + booking + conflict)
- Security measures recap

### Live Demo Script
- Login as patient → browse doctors → book appointment
- Show “My Appointments”
- In Postman: attempt double-book → show **409**
- Login as admin → create a doctor (authorized)

---

## 11) Phase 2 Implementation Plan
- Build React UI screens listed above with consistent UX patterns
- Implement Flask REST APIs with JWT auth and role checks
- Implement PostgreSQL schema + migrations and enforce constraints
- Create Postman collection + screenshots as evidence

