# serverless-queue

An Observable Framework article. This is a **standalone project with its own
build step**, intentionally kept outside the main Astro site's single build
(see [`../../docs/architecture.md`](../../docs/architecture.md), option 3:
"heavy standalone app").

## Workflow

This project is built independently. **All builds and artifact placement are
driven from the root `Makefile`** — this project never reaches up into the
parent repository or writes to `public/`. It only knows how to build itself
into its own local `dist/`.

```sh
# local development only (from this directory):
npm install        # one-time, installs Observable Framework locally
npm run dev        # live preview at http://127.0.0.1:3000

# building + publishing the artifact is done from the repo ROOT:
make build-serverless-queue         # reproducible build (npm ci)
make local-build-serverless-queue   # build with `npm install` (updates the lockfile)
```

The root Makefile builds this project and copies its `dist/` into
`public/work/serverless-queue/app/`. That output is **git-ignored** and rebuilt
during deploy (`make build`) — only the source in this directory is committed.

`make build-*` uses `npm ci`, so this project must commit its
`package-lock.json`. After adding or bumping a dependency, run
`make local-build-serverless-queue` (which uses `npm install`) and commit the
updated lockfile.

## Why it's structured this way

- GitHub Pages allows exactly one build step; the main site uses Astro/Vite.
- Observable Framework is its own static site generator with its own build.
- So we build the artifact via the root Makefile, serve it from `public/`, and
  link to it from the main site rather than stitching two build systems
  together. The artifact is git-ignored and rebuilt on deploy.

## Linking from the main site

The article lives at `src/content/work/serverless-queue.md` and is rendered by
Astro at `/work/serverless-queue/` (this is what the home-page card links to).
That article body links to this standalone app at `/work/serverless-queue/app/`,
which is where the Makefile publishes this project's build. Hence
`base: "/work/serverless-queue/app/"` in `observablehq.config.js`.
