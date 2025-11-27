# PocketSchool – Frontend Technical Implementation

## Goals

Keep the current Megamind PWA UX (dashboard → courses → lectures/assignments) while swapping local-only storage for REST-backed data. Maintain installability, mobile-first layouts, and minimal dependencies.

## Stack & App Shell

- React 18 + TypeScript, Vite 5, React Router 6.
- Global styles in `src/index.css`; reusable components in `src/components`.
- PWA: existing `manifest.webmanifest` + `public/sw.js`; service worker caches the app shell and last-read API GET responses (stale-while-revalidate).
- Build: `npm run build` → static assets served via CDN; API base injected via `VITE_API_BASE_URL`.

## Routing & Screens

- `/` Dashboard: greeting, focus course card, active courses grid, assignments snapshot.
- `/courses` Courses library: add course form, course cards with progress + focus toggle.
- `/courses/:courseId` Course detail: progress bar, status selector, lecture list + add lecture, assignments list + add assignment, course notes.
- `/courses/:courseId/lectures/:lectureId` Lecture detail: video link, status selector, notes.
- `/assignments` Cross-course list with status filter and per-assignment notes.
- Auth overlay (new): login/register modal shown when no token; on success load data and return to last route.

## Data Flow & State

- `AppStateContext` holds `user`, `courses`, and `focusCourseId`. It hydrates from:
  1) cached snapshot (localStorage/IndexedDB) for instant paint,
  2) `GET /users/me` + `GET /courses` for fresh data.
- Actions call an `apiClient` wrapper (`fetch` with base URL + auth header). On success, reducer replaces local copies with server responses to keep parity.
- Optimistic updates for status/notes; failed writes trigger inline toasts and revert to cached data.
- Token handling: store access token in memory, refresh via `POST /auth/refresh` before expiry; fallback to re-login when refresh fails.

## UI Contracts to Backend

- Course card needs: `id, title, status, progress (derived or computed client-side), nextLecture?`.
- Lecture list requires ordered lectures with status + videoUrl.
- Assignment list requires status and optional `link`/`note`.
- Focus course and display name live on the user profile; PATCH endpoints keep them in sync.

## Forms & Validation

- Client-side checks: required fields (title, source URL, lecture title/url), URL shape for sources/videos, non-negative numbers for ordering/durations.
- Server-side errors bubble up via error envelope; show inline messages next to fields.

## Testing & Quality

- Keep existing manual flows; add lightweight tests where helpful:
  - Unit: `utils/progress` calculations with API-shaped data.
  - Integration (optional): mock `apiClient` to ensure reducers handle server responses.
- Accessibility: preserve focus outlines, label/input pairing, and keyboard navigation already present in pages.

## Offline Behaviour

- Read paths (`GET /courses`, `GET /users/me`) cached; when offline, show cached data with a banner.
- Writes queue is out-of-scope for v1; disable write buttons when offline to avoid silent drops.
