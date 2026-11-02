# Gauvreau CPA Documentation Portal

Browse the Gauvreau law-firm accounting tools and watch sample runs

## What This Does
Accounting staff need a single place to see what each Gauvreau tool for law firms does. This static website describes ten tools for Clio and QuickBooks Online (QBO), each on its own page. It also has a simulator that plays back a sample run, so you can show a firm what a tool looks like at work.

## Features
- Interactive tool simulator
- Application workflow guides
- Tool card overview
- Static site generation

## Feature Details

### Interactive tool simulator
What it does: Lets you play a scripted sample run of a tool inside a console window on the home page.

Why it matters: You can show a firm what a run looks like without touching any client data.

How to use it:
1. Click Launch Simulator on the navigation bar.
2. Pick the QuickBooks Bridge tab or the Rate Rules Engine tab.
3. Click Run Automation Task.

What happens next: The console prints the sample run line by line, with warnings and successes in their own colours.

### Application workflow guides
What it does: Handles explaining each tool's billing, reconciliation or trust transfer workflow on its own page.

Why it matters: You won't miss a step like the Form 9A trust requisition when you walk a firm through a tool.

How to use it:
1. Click Our Tools on the navigation bar.
2. Click a tool card to open that tool's page.
3. Read the How it works steps and the feature list.

What happens next: You see that tool's workflow, features and, on most pages, a FAQ.

### Tool card overview
What it does: Takes care of showing every tool as a card with a short summary, all in one grid.

Why it matters: Your team can pick the right tool for a migration task in a few seconds.

How to use it:
1. Click View Applications on the home page.
2. Scroll through the tool cards and read each summary.
3. Click a card to open its page.

What happens next: The browser opens that tool's page.

### Static site generation
What it does: Lets you build the whole site as plain HTML pages with `npm run build`.

Why it matters: You get fast page loads without running a database or server.

How to use it:
1. Open a terminal in the repository folder.
2. Run `npm install`, then `npm run build`.
3. Push your changes to the `main` branch to publish them.

What happens next: The build lands in the `dist` folder, and the Deploy to GitHub Pages workflow publishes the site from `main`.

## Quick Start
1. Run `npm install` in your terminal to install dependencies.
2. Run `npm run dev` to launch the local development server.
3. Open `http://localhost:4321` in your web browser.
4. The home page loads with the tool cards and the simulator.

## Requirements
- Node.js 22.12 or later
- Build and developer notes: DEVELOPING.md
