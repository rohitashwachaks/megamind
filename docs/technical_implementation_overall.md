# PocketSchool – Technical Implementation (Overall)

Goal: turn the current Megamind PWA into PocketSchool, a two-tier system (React PWA + Flask API) that stays simple, stable, and easy to host. Frontend keeps the existing flows, while the backend owns auth, persistence, and MIT OCW–aligned course data.

## Architecture & Responsibilities

- Frontend (React + TS, Vite, PWA): routing/UI, offline-friendly cache, optimistic UX, form validation, token storage/refresh, and calling REST endpoints.
- Backend (Flask): Handles authentication, authorization, and the REST API. It uses a database factory to connect to either MongoDB (default) or SQLite for data persistence.
- Delivery: frontend builds to static assets served by CDN/host; backend exposed under `/api/v1` behind HTTPS; CORS allowed for the web origin.

## Communication Contract

- Base URL: `/api/v1`.
- Auth: `POST /auth/register`, `POST /auth/login` return access + refresh JWTs (HTTP-only refresh cookie recommended; bearer access token in `Authorization` header).
- Standard response envelope:

  ```json
  { "data": { /* payload */ }, "meta": { "trace_id": "uuid" } }
  ```

  Errors: `{"error": {"code":"string","message":"human readable","fields":{...}}}` with appropriate HTTP status.
- Status enums (shared): `courseStatus=active|completed|parked`, `lectureStatus=not_started|in_progress|completed`, `assignmentStatus=not_started|in_progress|submitted|skipped`.
- Versioning: `/api/v1/*` to keep later changes additive.

## Core Resources & Schemas

- User: `{ id, email, displayName, focusCourseId?, createdAt, updatedAt }`.
- Course: `{ id, title, description, source, status, tags?, notes, lectures: Lecture[], assignments: Assignment[], createdAt, updatedAt }`.
- Lecture: `{ id, courseId, order, title, videoUrl, durationMinutes?, status, note?, createdAt, updatedAt }`.
- Assignment: `{ id, courseId, title, status, dueDate?, link?, note?, createdAt, updatedAt }`.
- Note storage is embedded on lectures/courses for v1 (no separate table exposed to clients).

## Key Endpoints (summary)

- Auth: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`.
- Profile: `GET /users/me`, `PATCH /users/me` (display name), `PATCH /users/me/focus-course`.
- Courses: `GET /courses`, `POST /courses`, `GET /courses/:id`, `PATCH /courses/:id`, `DELETE /courses/:id`.
- Lectures: `POST /courses/:courseId/lectures`, `PATCH /courses/:courseId/lectures/:lectureId`, `DELETE ...`.
- Assignments: `POST /courses/:courseId/assignments`, `PATCH /courses/:courseId/assignments/:assignmentId`, `DELETE ...`.
- Progress helper: `GET /courses/:id/progress` (derived counts) to avoid duplicating logic in the client.

## Request/Response Examples

- Get courses: `GET /courses` → `200 { "data": [Course, ...] }`.
- Update lecture status: `PATCH /courses/{courseId}/lectures/{lectureId}` with `{ "status": "completed" }` → `200 { "data": Lecture }`.
- Add course: `POST /courses` with `{ title, source, description?, tags? }` → `201 { "data": Course }`.

## Offline & Sync Strategy

- Frontend caches last-synced state locally (IndexedDB or localStorage) and replays changes when online.
- All writes return server truth; client replaces local copy with server response to avoid drift.
- Service worker keeps the shell + last API responses (stale-while-revalidate) but does not cache authenticated POST/PUT bodies.

## Deployment Notes

- Frontend: static host (Netlify/Vercel/GitHub Pages) with `/.well-known/assetlinks.json` optional for Android install.
- Backend: A Flask application, containerized for portability. It connects to a MongoDB or SQLite database for data persistence. It should be run behind a reverse proxy that provides HTTPS, and CORS should be restricted to the frontend origin.
- Env config: `API_BASE_URL`, `PWA_ENABLED=true`, `TOKEN_REFRESH_THRESHOLD_MINUTES`.
