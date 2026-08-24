# CLAUDE.md — Gauvreau Practice Automation Suite

Guidance for Claude Code (and other coding agents) working in this repository.

## What this repo is

A static **Astro** site: the Gauvreau CPA practice-automation marketing and tool
showcase. It documents and demonstrates five Clio Manage / QuickBooks Online
integration tools. There is no backend here — the "automation" is illustrated
via an interactive front-end simulator. Real product logic lives in the licensed
desktop/binaries, not in this repo.

## Environment & commands

```bash
node --version      # requires Node.js >= 22.12
npm install         # install deps (astro, lenis)
npm run dev         # dev server on http://localhost:4321 (can run --background)
npm run build       # production build to ./dist
npm run preview     # preview the build
```

Use `astro dev --background` for a managed background server
(`astro dev stop` / `astro dev status` / `astro dev logs`).

## Project map

- `astro.config.mjs` — site URL + a **custom Vite `directoryIndexPlugin`** that
  serves `index.html` for directory paths in dev (GitHub Pages parity). Do not
  remove it or deep links break in dev.
- `src/layouts/Layout.astro` — global `<head>`, design tokens (`:root` CSS vars),
  preloader, cursor glow, particle canvas, scroll progress bar, reveal observer.
- `src/layouts/SubpageLayout.astro` — layout for individual tool pages.
- `src/pages/*.astro` — one route per page; `index.astro` is the landing page
  with the tool grid + interactive simulator.
- `src/components/Preloader/` — animated logo preloader (Astro + client TS).
- `src/components/ambient/ambient.client.ts` — ambient visual effects.
- `src/styles/global.css` — global styles and design tokens consumed via
  `var(--gold)`, `var(--font-sans)`, etc.
- `public/fonts/` — self-hosted variable fonts (Cormorant Garamond, Outfit,
  DM Mono); `Layout.astro` also has a Google Fonts `<link>` fallback — keep the
  families in sync if changed.

## Conventions

- **Astro + TypeScript**. Components are `.astro`; interactive behavior is
  isolated client scripts (`is:inline` or `.client.ts`).
- **Performance & accessibility**: wrap motion in `requestAnimationFrame`, use
  `translate3d`/`will-change` for GPU compositing, and always guard animations
  behind `prefers-reduced-motion`.
- **Design tokens** live in `Layout.astro` `:root`. Reuse them; don't hardcode
  colors/spacing.
- Keep the site fully static — no server runtime, no secrets in the repo.

## Gotchas

- The dev server needs the directory-index plugin to mirror GitHub Pages routing.
- `public/` files are served as-is; `formatted_live_site.html`,
  `live_pretty.html`, and `qbo-notifications.html` are static demo artifacts, as
  is `build_index.py`.
- Don't commit `node_modules`, `.astro`, or `dist` (see `.gitignore`).

## Code Organization Standard (Gauvreau-CPA)

- One repo = one focused integration tool.
- Do **not** commit build artifacts: `build/`, `dist/`, `__pycache__/`,
  `*.spec`, `.venv/`, `node_modules/`, `target/` (see `.gitignore`).
- Python: put code in `src/<package>/` with a `python -m <package>` entry
  point; tests in `tests/`; config in `pyproject.toml`.
- File names use `snake_case.py` (no spaces, no camelCase).
- Repeated logic (Clio / QBO / Excel clients) belongs in the shared
  `gauvreau-common` package, not copied into every repo.
- Keep scripts small and single-purpose.
