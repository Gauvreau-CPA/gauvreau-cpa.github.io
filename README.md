# Gauvreau — Practice Automation Suite

> Purpose-built financial integration & billing automation tools for law firms running **Clio Manage**.

[![CI](https://github.com/Gauvreau-CPA/gauvreau-cpa.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/Gauvreau-CPA/gauvreau-cpa.github.io/actions/workflows/ci.yml)
![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01)
![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-lightgrey)

**Live site:** https://gauvreau-cpa.github.io

Gauvreau builds high-performance tools that turn manual accounting and billing
operations inside Clio Manage into automated, repeatable pipelines — bridging
legal practice management with QuickBooks Online and trust-accounting workflows.

## What's inside

The suite ships as a collection of standalone web applications, each targeting a
specific bottleneck in a law firm's Clio Manage workflow:

| Application | What it does |
| --- | --- |
| **Clio Reconciliation Tool** | Export, bulk-edit, and clear bank transactions inside Clio Manage. |
| **Clio Payment / Invoice Redater** | Securely back- or forward-date payments & invoices with dry-run validation. |
| **Clio → QuickBooks Bridge** | Sync legal disbursements into QBO vendor bills with attached receipts. |
| **Clio Rate Override Engine** | Enforce accurate time billing with automated, audited rate-matching rules. |
| **Trust Transfer Tool** | Prepare requisitions, print Form 9As, and update Clio via a two-person workflow. |

## Tech stack

- **[Astro](https://astro.build)** — static site generation with zero client JS by default.
- **TypeScript** — typed components and client scripts.
- **[Lenis](https://lenis.studio)** — smooth scrolling.
- A custom Vite plugin for GitHub Pages directory-index compatibility.
- Variable fonts bundled under `public/fonts/` (Cormorant Garamond, Outfit, DM Mono).

## Quick start

Prerequisites: **Node.js ≥ 22.12**.

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:4321
npm run build    # build the production site to ./dist
npm run preview  # preview the production build locally
```

## Project structure

```text
/
├── public/            # static assets, fonts, favicons
├── src/
│   ├── components/    # Astro components (Preloader, ambient effects)
│   ├── layouts/       # Layout.astro, SubpageLayout.astro
│   ├── pages/         # one .astro file per application / route
│   └── styles/        # global.css design tokens
├── astro.config.mjs   # site config + custom Vite directory-index plugin
└── package.json
```

## Architecture notes

- **Directory-index plugin** (`astro.config.mjs`): serves `index.html` for
  directory paths in dev so the site behaves like GitHub Pages.
- **Performance-first UI**: reveal-on-scroll, cursor glow, and a particle canvas
  are all `requestAnimationFrame`-driven and disabled under
  `prefers-reduced-motion`. Cards use `will-change` + `translate3d` for GPU
  compositing with no layout thrash.
- **Fonts**: self-hosted variable fonts live in `public/fonts/`; `Layout.astro`
  also includes a Google Fonts `<link>` fallback for the same families.

## Deployment

The site auto-deploys to **GitHub Pages** from the `main` branch via the
workflow in `.github/workflows`. A CI workflow (`.github/workflows/ci.yml`)
verifies every build before merge.

## License

All rights reserved. See [LICENSE](./LICENSE). Use is granted only under a
separate written license agreement with Gauvreau Accounting Tax Law Advisory.

---

© 2026 Gauvreau Accounting Tax Law Advisory.
