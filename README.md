# College Placement Tracker Dashboard

A full-stack web app to help students track and improve their placement readiness. Built with React + Tailwind (Vite) on the frontend and Node.js + Express + MongoDB on the backend.

## Features
- Student Profile: Name, Roll No, Department, CGPA
- Resume Upload (PDF) with a basic resume score and suggestions
- Aptitude Tests: store score, percentile, and view progress over time (line chart)
- Certifications: list with provider and verification links
- Interview Readiness: 0–5 rating + checklist (communication, technical, HR, problem solving)
- Overall Readiness: Top-level percent indicator combining multiple signals
- Admin/Faculty Panel: filter by department/readiness and export CSV summary
- Goals: students set personal placement goals and mark them complete

## Tech Stack
- Frontend: React + Vite + TailwindCSS, Recharts for charts
- Backend: Node.js + Express
- Database: MongoDB with Mongoose

## Monorepo Structure
```
sih/
  client/            # React + Vite + Tailwind frontend
  server/            # Node + Express + MongoDB backend
  README.md
```

## Prerequisites
- Node.js 18+
- MongoDB running locally (or a cloud connection string)

## Setup
1. Clone or open this folder in your IDE.
2. Backend env:
   - Copy `server/.env.example` to `server/.env` and set variables if needed.
   - Defaults:
     - `PORT=5000`
     - `MONGODB_URI=mongodb://localhost:27017/placement_tracker`
     - `CLIENT_URL=http://localhost:5173`
3. Frontend env:
   - Copy `client/.env.example` to `client/.env` if you want to override `VITE_API_URL`. Default is `http://localhost:5000`.

## Install Dependencies
From the `sih/` root, run both installs (in two terminals or one-by-one):

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

## Run Locally
Start MongoDB locally or point `MONGODB_URI` to your cluster.

```bash
# Terminal 1: backend
cd server
npm run dev
# server runs on http://localhost:5000

# Terminal 2: frontend
cd client
npm run dev
# frontend runs on http://localhost:5173
```

Open the frontend in your browser: http://localhost:5173

## Usage Tips
- Create your profile in the Dashboard section (top form). The app will store your created student ID in localStorage and fetch it on reload.
- Upload a PDF resume to get a score and suggestions.
- Add aptitude scores/percentiles to see the chart evolve.
- Add certifications with optional verification links.
- Update interview readiness rating and checklist.
- Add personal goals and mark them as completed.
- Use the Admin Panel to filter students by department or readiness levels and export a CSV summary.

## API Overview
- Health: `GET /api/health`
- Student:
  - `POST /api/students` upsert profile body: `{ name, rollNo, department, cgpa, certifications?, interviewReadiness?, goals? }`
  - `GET /api/students/:id`
  - `POST /api/students/:id/aptitude` body: `{ score, percentile, date? }`
  - `POST /api/students/:id/resume` multipart form-data: `resume: <PDF>`
- Admin:
  - `GET /api/admin/students?department=&readiness=good|average|needs`
  - `GET /api/admin/export` -> CSV download

## Notes
- Resume scoring is a basic placeholder in `server/src/utils/resumeScorer.js`. Replace with a real parser/scorer if desired.
- File uploads are stored in `server/uploads/` and served at `/uploads/...`.
- CORS is configured to allow the dev frontend URL.

## Roadmap / Ideas
- Authentication (students/admins)
- Richer resume analysis (ATS parsing, keyword coverage, section detection)
- Recommendations: courses or practice tests based on weak areas
- Better admin analytics and charts

## License
MIT
