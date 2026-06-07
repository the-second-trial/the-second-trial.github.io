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
| Heavy standalone app    | prebuilt artifact in `public/work/<slug>/app/` | built via root `Makefile`; git-ignored, rebuilt on deploy |
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

For WASM/WebGL apps that need their own toolchain, build them *outside* the
Astro pipeline (via the root `Makefile`) so their static output lands in
`public/work/<slug>/app/`, then link to it from the Astro-rendered article at
`/work/<slug>/`. This keeps the site's pipeline to a single Astro build. The
output is git-ignored and rebuilt on deploy.

#### Concrete pattern (used by `projects/serverless-queue/`, an Observable Framework article)

1. **Source** lives in a top-level `projects/<slug>/` directory — outside
   `src/`, so Astro's Vite build never touches it. It has its own
   `package.json` and a build step that compiles **only into its own local
   `dist/`**. A project NEVER writes to `public/` or otherwise reaches up into
   the parent repository.
2. **The root `Makefile` is the single entry point for building and publishing
   projects.** It installs the project's deps, runs its build, and copies the
   project's `dist/` into `public/work/<slug>/app/`. Artifact placement into
   `public/` happens *only* here — never inside a project's own scripts.

   ```sh
   make build-<slug>         # build one project into public/work/<slug>/app/ (npm ci)
   make build-projects       # build all projects (npm ci)
   make build                # all projects (npm ci), then the main Astro site
   make local-build-<slug>   # build with `npm install` (updates the lockfile)
   ```

   The default `build-*` targets use `npm ci`: reproducible, they install
   strictly from the committed `package-lock.json` and never mutate it. Use the
   `local-build-*` targets (which use `npm install`) when adding or bumping a
   project's dependencies, then commit the updated `package-lock.json`. CI and
   deploys use the `npm ci` targets, so each project must commit its lockfile.

   When you add a project, append its slug to the `PROJECTS` variable in the
   Makefile.
3. The standalone build's `base`/sub-path must match the public path — it is
   published under an `app/` sub-path, e.g. Observable's
   `base: "/work/<slug>/app/"`, or asset URLs break.
4. The generated files under `public/work/<slug>/` are **git-ignored** and
   rebuilt during deploy — they are not committed. The deploy pipeline runs
   `make build` (all projects, then the Astro site). Source lives only in
   `projects/<slug>/`.
5. **Surfacing it on the site:** add a normal `work` content entry
   (`src/content/work/<slug>.md`). The article is rendered by
   `work/[...slug].astro` like any other entry — the home-page card links to
   the article route `/work/<slug>/`. The article body links to the standalone
   app at `/work/<slug>/app/`. An optional `app: '/work/<slug>/app/'` front
   matter field records that association.

   **Why the `app/` sub-path matters:** the article and the standalone app must
   live at *different* paths. The article is an Astro route at `/work/<slug>/`;
   the app is a static artifact under `/work/<slug>/app/`. Putting the app at
   the same path as the article would collide at build time.

   **Dev-server caveat:** the Astro dev server (`npm run dev`) serves Astro
   routes (the article) fine, but does NOT resolve directory-index for static
   `public/` artifacts — so `/work/<slug>/app/` returns 404 in dev. It works in
   the production build; test standalone apps via `make preview`.

### Independent lifecycle (escape hatch)

If a project is heavy enough or maintained independently enough to warrant its
own release cadence, give it its own repository and its own GitHub Pages
deploy, then **link** to it from this site. Federation by hyperlink beats
federation by build glue for a personal site.

## Invariants for agents

- There is exactly **one** build step for the site. Never introduce build
  orchestration across multiple build systems inside this repo.
- The root `Makefile` is the **only** thing that builds standalone projects and
  writes to `public/work/`. A project must never reach up into the parent repo
  or touch `public/`; it builds only into its own local `dist/`.
- Prefer the lowest-infrastructure option that fits the project's kind.
- Spinning out a separate repo is a deliberate escape hatch, not the default.
