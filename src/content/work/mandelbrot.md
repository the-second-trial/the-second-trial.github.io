---
title: 'Drawing the Mandelbrot Set'
description: 'An interactive zoom into infinite complexity, rendered pixel by pixel in the browser.'
tags: ['math', 'interactive']
date: 2025-09-30
---

The Mandelbrot set is defined by a rule so short it fits on a napkin: repeatedly
apply `z → z² + c` and ask whether the result stays bounded. From that, an
infinitely detailed coastline of spirals and filaments emerges.

## Pixel by pixel

Each point on the screen is a value of `c`. Iterate, check whether it escapes,
and color it by how long it took. Zoom in anywhere and the detail never runs
out — the boundary is genuinely infinite.

This renderer lets you fall into it.
