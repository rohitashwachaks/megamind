# Hosting & PWA Setup Guide

This guide walks through deploying Megamind to free/static hosts and installing the PWA on Android and iOS.

## Prerequisites

- Node 18+ and npm
- A GitHub repository (for Vercel/Netlify/GitHub Pages flows)
- Built assets live in `dist` (`npm run build`)

## 1) Build locally (all hosts)

```bash
npm install
npm run build
# dist/ now contains the static site
```

## 2) Deploy options (free tiers)

### Option A: Netlify (zero-config UI)

1. Push the repo to GitHub.
2. Sign in to Netlify → **Add new site → Import an existing project**.
3. Select the GitHub repo.
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy. Netlify gives you a live URL; enable **Site settings → Domain management** to set a custom name.
7. For drag-and-drop: run `npm run build` locally, then drag `dist/` into Netlify Drop (<https://app.netlify.com/drop>).

### Option B: Vercel (UI)

1. Push the repo to GitHub.
2. Sign in to Vercel → **Add New… → Project**.
3. Import the repo. Vercel auto-detects Vite; if not, set:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy. Copy the generated URL or add a custom domain in **Settings → Domains**.

### Option C: GitHub Pages (Actions, free account friendly)

1. Push the repo to GitHub.
2. In GitHub:
   - Go to **Actions** → **New workflow** → search for “Pages” or “Vite”. If the template is missing, choose “set up a workflow yourself” and use a job that runs `npm ci`, `npm run build`, then uploads `dist` via `actions/upload-pages-artifact` and deploys with `actions/deploy-pages`.
   - If **Settings → Pages** does not show a “GitHub Actions” source (common on basic accounts), the workflow will still publish to the `gh-pages` branch automatically. In that case, set Source to “Deploy from a branch” and pick `gh-pages` / `/ (root)` after the first run.
3. After the workflow runs, the site appears at `https://<user>.github.io/<repo>/`.
4. If the repo is **not** served from root, set `base` in `vite.config.ts` (e.g., `base: "/megamind/"`) so assets resolve correctly.

## 3) Verify PWA installability

1. Open the deployed URL in Chrome (desktop) → DevTools → Application → Manifest. Confirm no errors on the manifest/service worker and that “Installable” is green.
2. Visit the site once while online so the service worker caches the shell.

## 4) Install the PWA on mobile

### Android (Chrome)

1. Open the deployed URL in Chrome.
2. Wait for the page to load; tap the **⋮** menu.
3. Choose **Add to Home screen** (or “Install app”).
4. Confirm the name and tap **Add**. The app opens full-screen from the home screen.

### iPhone (Safari)

1. Open the deployed URL in Safari (required for installation).
2. Tap the **Share** icon.
3. Select **Add to Home Screen**.
4. Confirm the name → **Add**. Launch from the new icon for a standalone view.

### Usage tips

- If you change the icon or manifest, refresh the site and reinstall on mobile to update the home-screen icon.
- If the app appears “stale,” open it once while online to let the service worker fetch updates; a second reload picks up the new cache.
