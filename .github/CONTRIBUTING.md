# Contributing

Thanks for your interest in the Gauvreau Practice Automation Suite.

This repository hosts the **static showcase site** for Gauvreau's Clio Manage /
QuickBooks Online automation tools. Active development of the licensed product
is managed internally; this guide covers contributions to the website itself.

## Getting started

```bash
npm install
npm run dev
```

Requires **Node.js ≥ 22.12**.

## Branching & PRs

1. Create a feature branch off `main` (e.g. `fix/preloader-flash`).
2. Keep changes focused and small.
3. Run `npm run build` locally and make sure it succeeds.
4. Open a PR against `main` and fill out the template.

## Coding standards

- **Astro + TypeScript.** Keep components in `src/`.
- Reuse design tokens from `:root` in `src/layouts/Layout.astro`.
- Animations must be `requestAnimationFrame`-based and respect
  `prefers-reduced-motion`.
- Fonts are self-hosted under `public/fonts/` (plus a Google Fonts fallback link
  in `Layout.astro`); keep families in sync if changed.
- Keep the site fully static — no server runtime, no secrets.

## Reporting issues

Please use the issue templates. For security concerns, follow
[SECURITY.md](./SECURITY.md) and do **not** open a public issue.

## Code of conduct

All contributors are expected to follow our
[Code of Conduct](./CODE_OF_CONDUCT.md).
