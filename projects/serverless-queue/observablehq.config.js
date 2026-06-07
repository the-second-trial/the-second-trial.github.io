// Observable Framework configuration.
// See https://observablehq.com/framework/config for all options.
//
// IMPORTANT: this project is built INDEPENDENTLY of the main Astro site.
// Its output is copied into the main site's `public/work/serverless-queue/app/`
// directory and served verbatim by GitHub Pages. Because of that:
//
//   - `root` points at this project's own `src` directory.
//   - `base` MUST match the public sub-path the artifact is served from,
//     so that all generated asset/link URLs resolve correctly.

export default {
  title: "Serverless Queue",

  // The app lives at https://the-second-trial.github.io/work/serverless-queue/app/
  // (a sub-path of the Astro-rendered article at /work/serverless-queue/).
  base: "/work/serverless-queue/app/",

  root: "src",

  // A single-article project: hide the sidebar and table of contents.
  sidebar: false,
  toc: false,

  // Keep .html off links; GitHub Pages handles clean URLs fine for
  // sub-directories, but we add a .nojekyll on build to be safe.
  cleanUrls: true,

  // Optional footer.
  footer: ({ path }) =>
    `Part of <a href="/">the-2nd-trial</a>.`,
};
