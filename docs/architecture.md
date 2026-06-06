# Architecture & Project Strategy

This document records *why* the site is structured the way it is, so the
decision doesn't have to be re-litigated every time a new project is added.

## Context

The site hosts many projects. Each project is a standalone article,
experiment, or initiative that produces its own page. Projects vary in
technical nature: some are pure prose (articles), others are interactive apps
(canvas, WebGL, WASM, framework UIs).

The hosting target is **GitHub Pages**, which permits exactly **one** build
step per site.

## Decision

**One repository, one Astro build (a monorepo).** Projects are organized by
*kind*, not by separate repositories or separate build systems.

## Options considered

### A. Folder-per-project, each with its own build system (rejected)

One repo, but each project folder carries its own toolchain (Vite, raw JS,
etc.) and the top level orchestrates them.

- Pro: single repo, single deploy, single git history, atomic commits.
- Con: GitHub Pages allows only one build step. "Each with its own build
  system" forces a hand-rolled build orchestrator — build the Astro shell,
  then shell out to build each sub-project, copy each `dist/` into the right
  subpath, and patch base paths. This glue is fragile and becomes a permanent
  maintenance burden.

### B. Repo-per-project, deploy together (rejected as default)

Each project lives in its own repository; a deploy mechanism stitches them.

- Pro: clean isolation, independent tooling per project.
- Con: stitching on GitHub Pages requires git submodules (painful) or CI that
  checks out N repos and assembles them. Loses the atomic single-history feel.
  Disproportionate infra for a personal site.

### C. Monorepo, single build, split by kind (chosen)

Keep one repo and one Astro build. Self-containment comes from per-project
*folders*, not per-project build systems.

## How to add a project

| Project kind            | Where it goes                              | Build impact |
| ----------------------- | ------------------------------------------ | ------------ |
| Article (prose/code)    | `src/content/work/<slug>.md`               | none |
| Interactive             | `src/pages/work/<slug>/` + client island   | handled by Astro's single Vite build |
| Heavy standalone app    | prebuilt artifact in `public/work/<slug>/` | built outside this pipeline; committed |
| Independent lifecycle   | its own repo + own GitHub Pages deploy     | separate; link to it |

### Articles

Markdown files in the `work` content collection (`src/content/work/`). Schema
is defined in `src/content.config.mjs` (title, description, tags, date).
Rendered by `src/pages/work/[...slug].astro`.

### Interactive projects

Add an Astro page and implement interactivity as a client-side island — a
plain `<script>` for light cases, or a framework island (React/Svelte/Vue) for
heavier UI. Astro's single Vite build bundles, hashes, and resolves base paths
automatically. **Do not** add a separate build system per project.

### Heavy standalone apps

For WASM/WebGL apps that need their own toolchain, build them *outside* this
pipeline and commit the static output to `public/work/<slug>/`, then link or
iframe it. This keeps the site's pipeline to a single Astro build.

### Independent lifecycle (escape hatch)

If a project is heavy enough or maintained independently enough to warrant its
own release cadence, give it its own repository and its own GitHub Pages
deploy, then **link** to it from this site. Federation by hyperlink beats
federation by build glue for a personal site.

## Invariants for agents

- There is exactly **one** build step. Never introduce build orchestration
  across multiple build systems inside this repo.
- Prefer the lowest-infrastructure option that fits the project's kind.
- Spinning out a separate repo is a deliberate escape hatch, not the default.
