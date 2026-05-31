---
title: 'Drawing the Mandelbrot Set'
description: 'An interactive zoom into infinite complexity, rendered pixel by pixel in the browser.'
tags: ['math', 'interactive']
date: 2025-09-30
---

The Mandelbrot set is defined by a rule so short it fits on a napkin: repeatedly
apply `z → z² + c` and ask whether the result stays bounded. From that, an
infinitely detailed coastline of spirals and filaments emerges.

> "Bottomless wonders spring from simple rules, repeated without end."
>
> — Benoît Mandelbrot

## Pixel by pixel

Each point on the screen is a value of `c`. Iterate, check whether it escapes,
and color it by how long it took. Zoom in anywhere and the detail never runs
out — the boundary is genuinely infinite.

The core of the renderer is just the **escape-time** loop:

```js
function escapeTime(cx, cy, maxIter) {
  let x = 0;
  let y = 0;
  let iter = 0;

  // bail out once |z| > 2 — the point has escaped to infinity
  while (x * x + y * y <= 4 && iter < maxIter) {
    const xt = x * x - y * y + cx;
    y = 2 * x * y + cy;
    x = xt;
    iter++;
  }

  return iter;
}
```

A few details decide whether the result looks crisp or muddy:

1. **Iteration budget.** Deep zooms need a higher `maxIter`, or fine filaments
   collapse into flat black.
2. **Escape radius.** Any value `> 2` works, but a larger radius makes
   smooth coloring cleaner.
3. **Smooth shading.** Instead of an integer count, blend with the fractional
   escape value so the bands don't look stepped.

### Smooth coloring

The trick is to subtract a logarithmic correction from the raw iteration count:

```python
import math

def smooth(iter_count, zx, zy):
    if iter_count == MAX_ITER:
        return iter_count
    log_zn = math.log(zx * zx + zy * zy) / 2
    nu = math.log(log_zn / math.log(2)) / math.log(2)
    return iter_count + 1 - nu
```

Some properties worth remembering while you explore:

| Property        | Value                                  |
| --------------- | -------------------------------------- |
| Dimension       | Boundary is fractal (~2)               |
| Symmetry        | Mirrored across the real axis          |
| Largest feature | The main cardioid                      |
| Connected?      | Yes — proven, though not obvious       |

You can read more in the [escape-time algorithm](https://en.wikipedia.org/wiki/Plotting_algorithms_for_the_Mandelbrot_set)
write-up.

---

This renderer lets you fall into it.
