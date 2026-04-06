## Backend (Flask + PostgreSQL)

### Setup (Windows PowerShell)
1) Start PostgreSQL via Docker (from project root):

```powershell
docker compose up -d
```

2) Create venv + install dependencies (from `backend/`):

```powershell
cd "c:\Users\ahmed\OneDrive\Desktop\System integration project\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

3) Create `.env`:
- Copy `.env.example` → `.env` and change secrets if you want.

4) Initialize DB:

```powershell
flask --app wsgi.py db init
flask --app wsgi.py db migrate -m "init"
flask --app wsgi.py db upgrade
```

5) Seed demo users (admin + 3 doctors):

```powershell
python seed.py
```

6) Run API:

```powershell
flask --app wsgi.py run --port 5000
```

### Health check
- `GET http://localhost:5000/api/health`

