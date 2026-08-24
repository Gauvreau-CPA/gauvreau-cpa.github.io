# AGENTS.md — Contributor & Agent Guide

This file helps autonomous coding agents and human contributors work effectively
in the **Gauvreau Practice Automation Suite** repository.

## Repository purpose

A static **Astro** website that showcases Gauvreau's Clio Manage / QuickBooks
Online practice-automation tools. It is documentation + an interactive demo, not
the licensed product binaries.

## Setup

1. Install **Node.js ≥ 22.12**.
2. `npm install`.
3. `npm run dev` (or `astro dev --background`).

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build → `./dist` |
| `npm run preview` | Preview the build |
| `npm run astro -- --help` | Astro CLI help |

## File map

- `astro.config.mjs` — config + custom Vite directory-index plugin (keep it).
- `src/layouts/` — `Layout.astro` (global shell + tokens), `SubpageLayout.astro`.
- `src/pages/` — routes; `index.astro` is the landing/showcase.
- `src/components/` — `Preloader/`, `ambient/`.
- `src/styles/global.css` — global styles.
- `public/fonts/` — self-hosted variable fonts (plus a Google Fonts fallback link
  in `Layout.astro`).

## Working conventions

- Astro + TypeScript; isolate interactivity in client scripts.
- Reuse CSS design tokens from `:root` in `Layout.astro`.
- Keep animations `requestAnimationFrame`-based and `prefers-reduced-motion`-safe.
- Keep the site static; never add secrets or a server runtime.

## Pull requests

- Open PRs against `main`. CI builds the site before merge.
- Follow the PR template; describe the change and link any related issue.
- Keep changes focused; one concern per PR.

## License

All rights reserved. See [LICENSE](./LICENSE).
