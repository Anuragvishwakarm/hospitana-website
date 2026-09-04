# Sahara Hospital — Hospitana Public Website

Public patient website for Sahara Hospital, Bhadohi. The visual system follows a clean blue-and-white clinical design while preserving the existing Hospitana FastAPI integrations.

## Main features

- Public home page with live hospital statistics, doctors, wards and gallery content
- Doctors directory with search and department filters
- Live beds and ward availability
- Patient registration, login and profile management
- Online appointment booking and appointment cancellation
- Password change flow
- AI hospital assistant
- About, departments, services, patient information and contact pages
- Graceful mock-data fallback for public doctors, wards and statistics

## Local setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Website: `http://localhost:3000`

## API configuration

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_HOSPITAL_NAME=Sahara Hospital
NEXT_PUBLIC_HOSPITAL_PHONE=084299 33131
```

The backend API contract remains unchanged. The website expects the Hospitana FastAPI routes under `/api/v1`.

## Main routes

- `/` — Home
- `/about` — About the hospital
- `/departments` — Medical departments
- `/doctors` — Doctor directory
- `/doctors/[id]` — Doctor profile
- `/services` — Hospital services
- `/rooms` — Live beds and wards
- `/patient-info` — Patient guidance
- `/book` — Appointment booking
- `/login`, `/register`, `/profile` — Patient account
- `/contact` — Contact details

## Production build

```bash
npm run build
npm start
```
