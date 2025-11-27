# Megamind – Technical Implementation

## Overview

Megamind is a PWA wrapper for open courses (MIT OCW-focused) with a clean split between a **React 18 + TypeScript** frontend and a lightweight **Flask** backend. The frontend keeps the dashboard/courses/lectures/assignments flows and calls REST endpoints under `/api/v1`. The backend seeds data from MIT OCW course structures and returns JSON envelopes that match `docs/rest_api_common_schemas.md`.

Relevant references used for UX and structure live in `reference_files/links.md` (MIT OCW homepage, course search, example course layouts, and PWA documentation).

## Stack & Tooling

- Frontend: React 18 + TypeScript, React Router 6, Vite 5 with `@vitejs/plugin-react`, service worker + `manifest.webmanifest` for PWA installability.
- Backend: Flask 3 + `flask-cors`, simple in-memory store seeded from `backend/data/seed.json` (aligned to MIT OCW course/lecture/assignment patterns).
- Dev server proxy: Vite proxies `/api/*` to `http://localhost:8000` so the frontend can call `/api/v1/*` without extra CORS headers during development.

## Data Model (src/types.ts)

- `Course`: id, title, description, source URL, status (`active|completed|parked`), notes, lectures, assignments, tags, timestamps.
- `Lecture`: id, courseId, order, title, videoUrl, status (`not_started|in_progress|completed`), optional duration/note, timestamps.
- `Assignment`: id, courseId, title, status (`not_started|in_progress|submitted|skipped`), optional link/dueDate/note, timestamps.
- `User`: id, email, displayName, optional focusCourseId, timestamps.

## State & API Integration (src/state/AppStateContext.tsx)

- Single React context with `useReducer`; actions cover adding/updating courses, lectures, assignments, notes, and focus course.
- Initial load hits `GET /users/me` and `GET /courses` concurrently; errors surface in-page with retry.
- Mutations are optimistic per action and rely on backend responses to keep local state in sync.
- API client (`src/api/client.ts`) wraps `fetch`, handles JSON envelopes, and exposes typed methods for each resource.

## Backend (backend/app.py)

- Endpoints: `GET/PATCH /users/me`, `PATCH /users/me/focus-course`, `GET/POST /courses`, `GET/PATCH /courses/:id`, `POST/PATCH /courses/:id/lectures/:lectureId`, `POST/PATCH /courses/:id/assignments/:assignmentId`, plus `/health`.
- Validation: checks URLs, enum membership for statuses, and required fields; errors return the `{ "error": {...}, "meta": { traceId } }` envelope.
- Data: in-memory store seeded from `backend/data/seed.json`; timestamps use UTC ISO-8601. CORS is open for `/api/*` to keep local dev simple.

## UI & Routing (src/App.tsx + pages)

- **Dashboard**: greeting + editable display name, “Next up” card for the focus course, active courses list, and assignments snapshot.
- **Courses**: add course form; course cards show progress, next lecture, source link, and focus toggle.
- **Course detail**: progress bar, status selector, lecture list with quick status updates, add-lecture form, assignments list with status updates and add-assignment form, and course-level notes.
- **Lecture detail**: per-lecture status and note-taking with a direct video link.
- **Assignments**: cross-course view with status filtering and per-assignment reflection field.
- **Not found**: simple fallback.

## PWA & Offline

- `public/manifest.webmanifest` defines names, colors, and icons.
- `public/sw.js` caches the app shell (`/`, manifest) on install, cleans old caches on activate, and runtime-caches GET requests. Navigation falls back to cached shell when offline.
- Registration lives in `src/serviceWorkerRegistration.ts`, invoked from `src/main.tsx`.

## Running & Building

```bash
# Backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt
python backend/app.py  # serves http://localhost:8000/api/v1

# Frontend
npm install
npm run dev            # Vite dev server; /api proxied to the backend
npm run build          # type-check + production build
npm run preview        # preview built app
```

## Future Extensions

- Persist backend state to SQLite or a file store instead of in-memory.
- Add auth endpoints (login/register) and token handling when moving beyond single-user.
- Import helpers for OCW playlist/course URLs to auto-create lecture lists.
- Flashcards/review tab backed by existing notes data.
- Theming toggle and a “focus mode” lecture view.
