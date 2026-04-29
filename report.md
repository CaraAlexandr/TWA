# Raport Laborator - Smart Notes

## 1. Titlu

Smart Notes este o aplicație web full-stack pentru administrarea notițelor personale. Proiectul implementează operații CRUD complete folosind FastAPI pentru backend, PostgreSQL pentru persistarea datelor și React cu Ant Design pentru interfața utilizator.

## 2. Introducere

Scopul proiectului este realizarea unei aplicații practice, ușor de rulat local și pregătită pentru deploy în cloud. Tema aleasă este o aplicație de notițe deoarece permite demonstrarea clară a conceptelor importante din dezvoltarea web: modelarea datelor, expunerea unui API REST, validarea inputului, persistarea într-o bază de date relațională și consumarea API-ului dintr-o interfață modernă.

Aplicația permite utilizatorului să creeze notițe, să le vizualizeze într-o listă centralizată, să vadă detaliile unei notițe, să editeze informațiile existente și să șteargă notițele care nu mai sunt necesare. În plus, proiectul include funcționalități utile pentru prezentare, precum căutare după titlu, pin/unpin și arhivare.

## 3. Cerințele Laboratorului

Proiectul respectă cerința de a avea cel puțin două ecrane, deoarece include o pagină de listare, o pagină de detalii și o pagină pentru creare/editare. Operațiile CRUD sunt implementate complet prin endpoint-uri REST și sunt integrate în interfața React.

Backend-ul este realizat cu Python și FastAPI, iar baza de date folosită este PostgreSQL. Nu este folosit SQLite. Migrațiile sunt gestionate cu Alembic, iar configurarea aplicației se face prin variabile de mediu. Frontend-ul este realizat cu React, Vite, Ant Design, React Router și Axios.

## 4. Alegerea Tehnologiilor

FastAPI a fost ales pentru backend deoarece oferă performanță bună, validare automată prin Pydantic și documentație Swagger generată automat. SQLAlchemy 2.x permite definirea clară a modelelor ORM și comunicarea cu PostgreSQL într-un mod robust. Alembic este folosit pentru migrații, astfel încât schema bazei de date să poată fi versionată.

React cu Vite a fost ales pentru frontend deoarece oferă o experiență rapidă de dezvoltare și un build optimizat pentru producție. Ant Design oferă componente vizuale mature, precum tabele, formulare, carduri, butoane, mesaje și confirmări de ștergere. Axios simplifică integrarea cu API-ul.

PostgreSQL este o bază de date relațională potrivită pentru aplicații reale și este disponibilă direct în Render, ceea ce face deploy-ul mai simplu.

## 5. Arhitectura Aplicației

Aplicația este împărțită în două module principale: backend și frontend. Backend-ul expune un API REST sub prefixul `/api`, iar frontend-ul consumă acest API folosind o instanță Axios configurată prin variabila `VITE_API_URL`.

Fluxul principal este următorul: utilizatorul interacționează cu interfața React, componenta de pagină apelează serviciul Axios, cererea ajunge la FastAPI, routerul apelează funcțiile CRUD, iar datele sunt citite sau modificate în PostgreSQL prin SQLAlchemy. Răspunsul este returnat în format JSON și afișat în UI.

## 6. Implementarea Backend-ului

Backend-ul este organizat modular. Fișierul `main.py` creează aplicația FastAPI, configurează CORS și include routerul pentru notițe. Configurarea este izolată în `core/config.py`, unde sunt citite variabilele de mediu precum `DATABASE_URL`, `FRONTEND_URL` și `CORS_ORIGINS`.

Modelul `Note` este definit în `models.py` și conține câmpurile cerute: `id`, `title`, `content`, `tag`, `is_pinned`, `is_archived`, `created_at` și `updated_at`. Schemele Pydantic din `schemas.py` validează datele de intrare și definesc forma răspunsurilor API.

Operațiile de acces la date sunt separate în `crud.py`. Routerul `routes/notes.py` expune endpoint-urile `GET`, `POST`, `PUT`, `PATCH` și `DELETE`. Pentru resurse inexistente se returnează codul HTTP 404 cu mesaj clar. Endpoint-ul `/health` oferă o verificare simplă pentru deploy și monitorizare.

## 7. Implementarea Frontend-ului

Frontend-ul este construit cu React și Vite. Navigarea este realizată cu React Router, iar interfața folosește componente Ant Design. Există trei pagini principale: `NotesListPage`, `NoteDetailsPage` și `NoteFormPage`.

Pagina de listare afișează notițele într-un tabel și oferă acțiuni pentru vizualizare, editare, ștergere, pin/unpin și arhivare. Pagina de detalii afișează toate informațiile despre o notiță și permite editarea sau ștergerea. Pagina de formular este reutilizată atât pentru creare, cât și pentru editare.

Aplicația include stări de loading, error state, empty state și mesaje de succes sau eroare după operații. Stilizarea este definită în `global.css`, iar layout-ul este construit cu Ant Design `Layout`, `Card`, `Table`, `Form`, `Input`, `Button`, `Tag`, `Popconfirm`, `message`, `Spin` și `Alert`.

## 8. Baza de Date PostgreSQL

Baza de date folosită este PostgreSQL. Conexiunea este configurată prin variabila de mediu `DATABASE_URL`, ceea ce permite folosirea aceleiași aplicații atât local, cât și în producție. Pentru compatibilitate cu Render, aplicația normalizează automat URL-urile care încep cu `postgres://` sau `postgresql://` către formatul acceptat de driverul `psycopg`.

Schema bazei de date este creată prin Alembic. Migrația inițială creează tabela `notes`, definește tipurile coloanelor și adaugă indexuri pentru `id`, `title` și `tag`.

## 9. Containerizarea Cu Docker

Backend-ul are un `Dockerfile` bazat pe imaginea oficială `python:3.12-slim`. Containerul instalează dependențele din `requirements.txt`, copiază codul aplicației, expune portul 8000 și pornește serverul Uvicorn. La pornire se execută și `alembic upgrade head`, astfel încât baza de date să fie adusă la ultima versiune.

Fișierul `docker-compose.yml` pornește două servicii: PostgreSQL și backend-ul FastAPI. PostgreSQL folosește un volum Docker pentru persistența datelor. Backend-ul depinde de healthcheck-ul bazei de date, astfel încât să pornească după ce PostgreSQL este pregătit.

## 10. Deploy Pe Render

Deploy-ul pe Render este pregătit pentru trei componente: PostgreSQL, backend Web Service și frontend Static Site. Backend-ul se deployează din directorul `backend` folosind Dockerfile-ul. Variabilele de mediu importante sunt `DATABASE_URL`, `FRONTEND_URL`, `CORS_ORIGINS` și `ENVIRONMENT`.

Frontend-ul se deployează ca Static Site din directorul `frontend`. Comanda de build este `npm install && npm run build`, iar directorul publicat este `dist`. Variabila `VITE_API_URL` trebuie să conțină URL-ul backend-ului, urmat de `/api`.

Fișierul `render.yaml` oferă o variantă de Blueprint deploy. După crearea serviciilor, URL-urile generate de Render trebuie verificate și, dacă este necesar, actualizate în variabilele de mediu.

## 11. Probleme Întâlnite Și Rezolvări

O problemă obișnuită este configurarea CORS. Aceasta este rezolvată prin citirea valorilor `FRONTEND_URL` și `CORS_ORIGINS` din environment variables și prin configurarea middleware-ului CORS în FastAPI.

O altă problemă posibilă este diferența dintre URL-ul PostgreSQL oferit de Render și formatul cerut de SQLAlchemy cu `psycopg`. Pentru aceasta, configurarea aplicației transformă automat prefixul URL-ului într-un format compatibil.

În frontend, o problemă frecventă este folosirea greșită a URL-ului API în producție. Proiectul rezolvă acest aspect prin `VITE_API_URL`, care este setat separat pentru local și pentru Render.

## 12. Concluzii

Smart Notes demonstrează construirea unei aplicații full-stack complete, pornind de la modelarea datelor și până la deploy. Proiectul folosește tehnologii moderne și potrivite pentru aplicații reale: FastAPI, PostgreSQL, SQLAlchemy, Alembic, React, Vite și Ant Design.

Structura modulară face codul ușor de înțeles și de prezentat. Separarea între backend, frontend, servicii API, scheme, modele și operații CRUD ajută la mentenanță și extindere.

## 13. Posibile Îmbunătățiri

Aplicația poate fi extinsă cu autentificare, utilizatori multipli, sortare avansată, filtrare după tag direct în interfață, markdown preview pentru conținutul notițelor și teste automate pentru backend și frontend.

O altă îmbunătățire utilă ar fi adăugarea unui pipeline CI/CD care rulează testele și verificările de lint înainte de deploy. Pentru o aplicație folosită în producție, ar fi utilă și adăugarea unui sistem de logging mai detaliat și monitorizare a erorilor.
