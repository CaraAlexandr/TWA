# Smart Notes

Smart Notes este o aplicație full-stack de tip CRUD pentru administrarea notițelor. Backend-ul este construit cu Python, FastAPI, SQLAlchemy 2.x, Alembic și PostgreSQL, iar frontend-ul folosește React, Vite, React Router, Axios și Ant Design.

Aplicația permite autentificare cu JWT, listarea, crearea, vizualizarea, editarea, ștergerea, căutarea, pin/unpin și arhivarea notițelor. Fiecare utilizator vede doar notițele proprii.

## Link Aplicație Live

- Frontend (Render): [https://frontend-fba3.onrender.com](https://frontend-fba3.onrender.com)

## Stack Tehnologic

- Backend: Python 3.12, FastAPI, SQLAlchemy 2.x, Alembic, Pydantic Settings, Uvicorn
- Bază de date: PostgreSQL
- Frontend: React, Vite, Ant Design, React Router, Axios
- Containerizare: Docker pentru backend și Docker Compose pentru backend + PostgreSQL
- Deploy: GitHub + Render Web Service + Render PostgreSQL + Render Static Site

## Arhitectură

Frontend-ul trimite cereri HTTP către API-ul FastAPI prin Axios. API-ul validează datele cu Pydantic, execută operații CRUD prin SQLAlchemy și persistă datele în PostgreSQL. Alembic gestionează schema bazei de date prin migrații.

## Structura Proiectului

```text
project-root/
  backend/
    app/
      core/config.py
      routes/notes.py
      crud.py
      database.py
      dependencies.py
      main.py
      models.py
      schemas.py
    alembic/
      env.py
      script.py.mako
      versions/202604290001_create_notes.py
    alembic.ini
    Dockerfile
    requirements.txt
    .env.example
  frontend/
    src/
      components/
      pages/
      services/api.js
      styles/global.css
      App.jsx
      main.jsx
    index.html
    package.json
    vite.config.js
    .env.example
  docker-compose.yml
  render.yaml
  report.md
  README.md
```

## Variabile de Mediu

Backend (`backend/.env`):

```env
DATABASE_URL=postgresql+psycopg://smart_notes:smart_notes_password@localhost:5432/smart_notes
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
ENVIRONMENT=development
SECRET_KEY=change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=1440
JWT_ALGORITHM=HS256
```

Frontend (`frontend/.env`):

```env
VITE_API_URL=http://localhost:8000/api
```

Copiază fișierele exemplu:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Rulare Locală Fără Docker

Ai nevoie de PostgreSQL instalat local și o bază de date creată:

```bash
createdb smart_notes
createuser smart_notes --pwprompt
```

Dacă userul există deja, setează parola și permisiunile conform instalării tale PostgreSQL.

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

API-ul va fi disponibil la `http://localhost:8000`, iar documentația Swagger la `http://localhost:8000/docs`.

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend-ul va rula la `http://localhost:5173`.

## Rulare Cu Docker

Docker Compose pornește PostgreSQL și backend-ul:

```bash
docker compose up --build
```

Backend-ul va rula la `http://localhost:8000`. Frontend-ul se rulează separat:

```bash
cd frontend
npm install
npm run dev
```

Pentru oprire:

```bash
docker compose down
```

Pentru ștergerea volumului PostgreSQL local:

```bash
docker compose down -v
```

## Migrații Alembic

Aplică migrațiile existente:

```bash
cd backend
alembic upgrade head
```

Generează o migrație nouă după modificarea modelelor:

```bash
cd backend
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

## Endpoint-uri API

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/notes`
- `GET /api/notes/{id}`
- `POST /api/notes`
- `PUT /api/notes/{id}`
- `PATCH /api/notes/{id}`
- `DELETE /api/notes/{id}`

Endpoint-ul `GET /api/notes` acceptă parametrii opționali `search`, `tag` și `include_archived`.

## Deploy Pe Render

### A. Creează baza de date PostgreSQL

1. Intră în Render Dashboard.
2. Alege `New` -> `PostgreSQL`.
3. Setează numele, de exemplu `smart-notes-db`.
4. Alege planul dorit.
5. După creare, copiază `Internal Database URL`.

### B. Creează backend Web Service din GitHub

1. Publică proiectul pe GitHub.
2. În Render, alege `New` -> `Web Service`.
3. Conectează repository-ul GitHub.
4. Setează `Root Directory` la `backend`.
5. Alege `Docker` ca runtime.
6. Health check path: `/health`.

### C. Setează variabilele de mediu pentru backend

În Render Web Service adaugă:

```env
DATABASE_URL=<Internal Database URL din Render PostgreSQL>
ENVIRONMENT=production
SECRET_KEY=<generează o valoare lungă și secretă>
ACCESS_TOKEN_EXPIRE_MINUTES=1440
FRONTEND_URL=https://smart-notes-frontend.onrender.com
CORS_ORIGINS=https://smart-notes-frontend.onrender.com
```

Render poate oferi URL de forma `postgres://...`; backend-ul îl normalizează automat pentru driverul `psycopg`.

### D. Rulează migrațiile

Dockerfile-ul rulează automat `alembic upgrade head` înainte de pornirea serverului. Alternativ, poți rula manual din Render Shell:

```bash
alembic upgrade head
```

### E. Creează frontend Static Site

1. În Render, alege `New` -> `Static Site`.
2. Conectează același repository GitHub.
3. Setează `Root Directory` la `frontend`.
4. Build command:

```bash
npm install && npm run build
```

5. Publish directory:

```bash
dist
```

### F. Setează `VITE_API_URL`

În environment variables pentru Static Site:

```env
VITE_API_URL=https://smart-notes-backend.onrender.com/api
```

După modificarea acestei valori trebuie redeployat frontend-ul, deoarece variabilele `VITE_` sunt incluse la build.

### G. Verifică aplicația după deploy

1. Deschide `https://smart-notes-backend.onrender.com/health`.
2. Deschide `https://smart-notes-backend.onrender.com/docs`.
3. Deschide URL-ul frontend-ului.
4. Creează o notiță, editeaz-o, arhiveaz-o și șterge-o.

## Deploy Cu Blueprint

Fișierul `render.yaml` poate fi folosit pentru un deploy Blueprint. După creare, actualizează URL-urile `FRONTEND_URL`, `CORS_ORIGINS` și `VITE_API_URL` dacă Render generează nume diferite pentru servicii.

## Probleme Frecvente

- Eroare CORS: verifică dacă `FRONTEND_URL` și `CORS_ORIGINS` conțin URL-ul frontend-ului.
- Backend-ul nu se conectează la baza de date: verifică `DATABASE_URL` și folosește URL-ul intern Render pentru backend.
- Frontend-ul apelează localhost în producție: setează `VITE_API_URL` în Render și redeployează Static Site-ul.
- Tabelele lipsesc: rulează `alembic upgrade head`.
- Port greșit pe Render: Dockerfile-ul folosește `${PORT:-8000}`, deci acceptă portul injectat de Render.

## GitHub

Inițializează și publică repository-ul:

```bash
git add .
git commit -m "Add Smart Notes full-stack app"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```
