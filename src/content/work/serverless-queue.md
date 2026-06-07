---
title: 'Serverless Queue'
description: 'An interactive exploration built with Observable Framework, served as a standalone app.'
tags: ['data', 'interactive']
date: 2026-06-06
app: '/work/serverless-queue/app/'
---

This article is rendered by the main site from Markdown, like any other entry.
The **interactive piece** is a separate [Observable Framework](https://observablehq.com/framework)
app, built independently and served as a static artifact.

## Why two pieces?

The prose you're reading lives in `src/content/work/serverless-queue.md` and is
rendered by Astro. The interactive part is an Observable Framework project (its
own build system), which we keep out of the main site's single build. It is
compiled separately and published under this article's `app/` sub-path.

See `docs/architecture.md` (option 3) for the rationale.

## Launch it

The full interactive app is here:

[→ Open the Serverless Queue app](/work/serverless-queue/app/)
