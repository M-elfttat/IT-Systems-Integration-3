## Run the Doctor Appointment System (Windows)

### 0) Prerequisites
- **Docker Desktop** installed and **running**
- **Python 3.12+** (already on your PC)
- **Node.js (LTS)** for React (not installed yet on your PC)

---

## 1) Start PostgreSQL (Docker)
1. Open **Docker Desktop** and wait until it shows **Running**.
2. In PowerShell (project root):

```powershell
cd "C:\Users\ahmed\OneDrive\Desktop\System integration project"
docker compose up -d
```

If `docker compose` fails, Docker Desktop is not running yet.

---

## 2) Run Backend (Flask API)
In PowerShell:

```powershell
cd "C:\Users\ahmed\OneDrive\Desktop\System integration project\backend"
.\.venv\Scripts\Activate.ps1
copy .env.example .env
flask --app wsgi.py db init
flask --app wsgi.py db migrate -m "init"
flask --app wsgi.py db upgrade
python seed.py
flask --app wsgi.py run --port 5000
```

Test:
- `GET http://localhost:5000/api/health`

---

## 3) Run Frontend (React)
Install **Node.js LTS** first (from the official website), then:

```powershell
cd "C:\Users\ahmed\OneDrive\Desktop\System integration project\frontend"
npm install
npm run dev
```

---

## Demo logins (seeded)
- Admin: `admin@sysint.local` / `Admin123!`
- Doctors: password is `Doctor123!`
  - `sara.cardiology@sysint.local`
  - `omar.derma@sysint.local`
  - `lina.pedia@sysint.local`

