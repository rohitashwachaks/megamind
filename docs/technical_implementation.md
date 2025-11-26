# Megamind – Technical Implementation

## Overview

Megamind is a local-first PWA wrapper for open courses (MIT OCW-focused) that tracks progress, notes, and lightweight assignments. The app is built with **React 18 + TypeScript** on **Vite 5** and ships a minimal service worker and web manifest for installability and offline resilience.

Relevant references used for structure and UX cues live in `reference_files/links.md` (MIT OCW homepage, search, and course examples alongside PWA documentation). Course and lecture naming in the seed data follow the MIT OCW layout: course landing page → lecture resources → assignments/problem sets.

## Stack & Tooling

- **React 18 + TypeScript** for maintainable, typed UI.
- **React Router 6** for lightweight routing across dashboard, courses, lectures, and assignments.
- **Vite 5** with `@vitejs/plugin-react` for fast dev/build.
- **PWA bits**: `manifest.webmanifest` plus a hand-rolled `public/sw.js` for installability and offline caching.
- **Local-first persistence** using `localStorage`; no backend required.

## Data Model (src/types.ts)

- `Course`: title, description, source URL, status (`active|completed|parked`), notes, lectures, assignments, tags.
- `Lecture`: order, title, videoUrl, status (`not_started|in_progress|completed`), optional duration/note.
- `Assignment`: title, link, status (`not_started|in_progress|submitted|skipped`), optional note/due date.
- `AppState`: userName, optional focusCourseId, array of courses.

## State & Persistence (src/state/AppStateContext.tsx)

- Single React context with `useReducer`; actions cover adding/updating courses, lectures, assignments, notes, and focus course.
- Local storage hydration (`megamind-state-v1`), with safe fallback to `src/data/seed.ts` if parsing fails.
- Status normalization: when all lectures are marked completed, the course auto-switches to `completed`; resetting lecture status reverts to `active`.
- ID helper (`src/utils/id.ts`) uses `crypto.randomUUID` where available, with a small fallback.

## UI & Routing (src/App.tsx + pages)

- **Dashboard**: greeting + editable display name, “Next up” card for the focus course, active courses list, and an assignments snapshot.
- **Courses**: add new course form; course cards show progress, next lecture, quick source link, and a focus toggle.
- **Course detail**: progress bar, status selector, sortable lecture list with quick status updates, add-lecture form, assignments list with status updates and add-assignment form, and course-level notes.
- **Lecture detail**: per-lecture status and note-taking with a direct video link.
- **Assignments**: cross-course view with status filtering and reflection field per assignment.
- **Not found**: simple fallback.

## Styling & UX

- Custom theme in `src/index.css` (Space Grotesk, dark app shell, pill chips, and grid cards). Buttons are reusable for both links and actions.
- Mobile-friendly layout: nav links collapse, grid cards stack, tap targets sized for touch.
- Gentle clarity cues: progress bars, status pills, subtle descriptions aligned to the design brief.

## PWA & Offline

- `public/manifest.webmanifest` defines name, colors, and icons (192/512 PNG + SVG).
- `public/sw.js` caches the app shell (`/`, manifest) on install, cleans old caches on activate, and runtime-caches GET requests. Navigation requests fall back to the cached shell when offline.
- Registration lives in `src/serviceWorkerRegistration.ts`, invoked from `src/main.tsx`.

## Running & Building

```bash
npm install
npm run dev       # start dev server
npm run build     # type-check + production build
npm run preview   # preview built app
```

No external services are required; all data stays in the browser.

## Future Extensions

- Import helpers for OCW playlist/course URLs (auto-create lecture lists).
- Flashcards/review tab backed by the existing note data.
- Optional cloud sync (Supabase/Firebase) while keeping local cache first.
- Theming toggle and a “focus mode” lecture view.

## Self-Review & Follow-Ups

- **Fixed** service worker registration guard (`"serviceWorker" in navigator`) to avoid false negatives.
- **Fixed** semantic issues by styling links as buttons instead of nesting buttons inside links.
- **Improved** status pills to represent `parked` vs. `active/completed` accurately.
- **Tightened** lecture add flow so order increments predictably after inserts.
- **Risk**: manual runtime caching keeps things simple but does not pre-cache hashed build assets; after first load the shell is cached. Consider Workbox or `vite-plugin-pwa` if stricter offline guarantees are needed.
