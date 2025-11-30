# PocketSchool · MIT OCW Companion

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) ![Status](https://img.shields.io/badge/status-PWA--ready-brightgreen) ![Built with Vite](https://img.shields.io/badge/build-Vite%205-8A2BE2) ![React](https://img.shields.io/badge/ui-React%2018-61dafb)

PocketSchool is the PWA wrapper for MIT OCW and other open courses. The frontend stays lightweight and mobile-first while the new Flask backend serves `/api/v1` endpoints for users, courses, lectures, and assignments.

## ✨ What it does

- Dashboard with “Next up” focus card and assignment snapshot.
- Course library with progress bars, source links, and focus toggle.
- Course detail: lecture list/status, add lectures, lightweight assignments, and course notes.
- Lecture detail: per-lecture status and note-taking with quick video access.
- PWA-ready: manifest, service worker, and icons for home-screen install.

## 🧰 Stack

- Frontend: React 18 + TypeScript, React Router 6, Vite 5 (`vite`, `vite preview`, `vite build`), hand-rolled service worker + manifest.
- Backend: Flask 3 + `flask-cors`, in-memory data seeded from `backend/data/seed.json`.

## 🚀 Quick start

```bash
# Backend (terminal 1)
python3 -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt
python backend/app.py          # http://localhost:8000/api/v1

# Frontend (terminal 2)
npm install
npm run dev                    # Vite dev server; /api proxied to backend
```

## 🌐 Deploy & host

- The app builds to static files in `dist/`. Any static host works (Netlify, Vercel, GitHub Pages).
- Serve the Flask API under `/api/v1` on the same origin or set `VITE_API_BASE_URL` accordingly.
- Hosting and mobile install instructions: `docs/hosting_guide.md`.

## 📱 PWA install (mobile)

- **Android (Chrome):** open the site → menu (⋮) → Add to Home screen / Install app.
- **iPhone (Safari):** open the site → Share → Add to Home Screen.

## 📖 Documentation

- Product/UX vision: [`docs/design.md`](/docs/design.md)
- Technical implementation: [`docs/technical_implementation.md`](docs/technical_implementation.md)
- Backend contract: [`docs/rest_api_common_schemas.md`](docs/rest_api_common_schemas.md)
- Hosting & PWA setup: [`docs/hosting_guide.md`](docs/hosting_guide.md)
- Reference links used: [`reference_files/links.md`](reference_files/links.md)

## 📝 Notes

- Backend data is in-memory; restart resets to `backend/data/seed.json`.
- If you change the manifest or icons, reload once online and reinstall the PWA to refresh home-screen assets.
