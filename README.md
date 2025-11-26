# Megamind · MIT OCW Companion

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) ![Status](https://img.shields.io/badge/status-PWA--ready-brightgreen) ![Built with Vite](https://img.shields.io/badge/build-Vite%205-8A2BE2) ![React](https://img.shields.io/badge/ui-React%2018-61dafb)

Megamind is a lightweight PWA wrapper for MIT OCW and other open courses. Track course progress, lectures, assignments, and notes in a mobile-first, installable web app.

## ✨ What it does

- Dashboard with “Next up” focus card and assignment snapshot.
- Course library with progress bars, source links, and focus toggle.
- Course detail: lecture list/status, add lectures, lightweight assignments, and course notes.
- Lecture detail: per-lecture status and note-taking with quick video access.
- PWA-ready: manifest, service worker, and icons for home-screen install.

## 🧰 Stack

- React 18 + TypeScript
- React Router 6
- Vite 5 (`vite`, `vite preview`, `vite build`)
- Local-first persistence via `localStorage`
- Hand-rolled service worker and web manifest

## 🚀 Quick start

```bash
npm install
npm run dev        # start dev server
npm run build      # type-check + production build to dist/
npm run preview    # preview built app
```

## 🌐 Deploy & host

- The app builds to static files in `dist/`. Any static host works (Netlify, Vercel, GitHub Pages).
- Step-by-step hosting and mobile install instructions: `docs/hosting_guide.md`.

## 📱 PWA install (mobile)

- **Android (Chrome):** open the site → menu (⋮) → Add to Home screen / Install app.
- **iPhone (Safari):** open the site → Share → Add to Home Screen.

## 📖 Documentation

- Product/UX vision: `docs/design.md`
- Technical implementation: `docs/technical_implementation.md`
- Hosting & PWA setup: `docs/hosting_guide.md`
- Reference links used: `reference_files/links.md`

## 📝 Notes

- Data is local-only by default; no backend required.
- If you change the manifest or icons, reload once online and reinstall the PWA to refresh home-screen assets.
