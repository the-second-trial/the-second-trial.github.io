# AGENTS.md

Steering notes for AI coding agents working in this repository.

## What this is

`the-second-trial.github.io` — a personal site built with **Astro** and deployed
to **GitHub Pages**. Each "project" is a standalone article, experiment, or
initiative that produces its own page.

## Project structure

- `src/content/work/` — article-type projects as markdown (content collection).
- `src/pages/` — site shell and dynamic routes (e.g. `work/[...slug].astro`).
- `src/components/`, `src/layouts/` — shared UI.
- `public/` — static assets and prebuilt standalone artifacts.

## Commands

- `npm run dev` — local dev server.
- `npm run build` — production build (single Astro/Vite build → `dist/`).
- `npm run preview` — preview the built site.

## Architecture strategy (read before adding a project)

This repo is a **monorepo with a single build**. There is exactly one build
step (GitHub Pages allows only one). Do **not** introduce per-project build
systems or build-orchestration glue.

How to add a new project depends on its kind:

1. **Article** (prose, code, tables) → add a markdown file to
   `src/content/work/`. No new infrastructure.
2. **Interactive** → add an Astro page under `src/pages/work/<slug>/` and use a
   client-side island (vanilla `<script>` or a framework island). Astro's
   single Vite build handles bundling, hashing, and base paths.
3. **Heavy standalone app** (WASM, big WebGL) → commit the prebuilt static
   output to `public/work/<slug>/` and link/iframe it. Build the artifact
   outside this pipeline; never add a second build system here.
4. **Independent lifecycle** → give it its own repo + its own GitHub Pages
   deploy, and **link** to it from this site rather than stitching builds.

Full rationale and trade-offs: [`docs/architecture.md`](docs/architecture.md).
