/**
 * Central list of articles and projects.
 *
 * To add a new entry, append an object to the `items` array below.
 *   - title:       display name
 *   - description: one or two sentence summary
 *   - href:        path to the static HTML file (e.g. "/work/my-piece.html")
 *   - tags:        array of lowercase topic tags (used for filter chips)
 *   - date:        optional ISO date string "YYYY-MM-DD"
 *
 * The filter chips on the homepage are derived automatically from the tags.
 */

/** @typedef {{ title: string, description: string, href: string, tags: string[], date?: string }} Item */

/** @type {Item[]} */
export const items = [
  {
    title: 'The Shape of Spacetime',
    description:
      'A visual walk through curvature, geodesics, and why gravity is less a force than a slope.',
    href: '/work/shape-of-spacetime.html',
    tags: ['physics', 'relativity'],
    date: '2026-05-12',
  },
  {
    title: 'Folding Proteins in the Browser',
    description:
      'An interactive toy model of protein folding energy landscapes, built with plain JavaScript.',
    href: '/work/protein-folding.html',
    tags: ['biology', 'data', 'interactive'],
    date: '2026-04-28',
  },
  {
    title: 'Counting Primes, Slowly and Quickly',
    description:
      'From trial division to the sieve of Eratosthenes — benchmarking how fast we can find primes.',
    href: '/work/counting-primes.html',
    tags: ['math', 'data'],
    date: '2026-03-30',
  },
  {
    title: 'A Field Guide to Exoplanets',
    description:
      'How we detect worlds we cannot see, and what their transit light curves quietly reveal.',
    href: '/work/exoplanet-field-guide.html',
    tags: ['astronomy', 'physics'],
    date: '2026-02-18',
  },
  {
    title: 'Cellular Automata Playground',
    description:
      'Conway, Wolfram, and friends — a sandbox for watching complexity emerge from simple rules.',
    href: '/work/cellular-automata.html',
    tags: ['math', 'interactive', 'data'],
    date: '2026-01-22',
  },
  {
    title: 'The Statistics of Almost',
    description:
      'p-values, confidence intervals, and the quiet ways we fool ourselves with data.',
    href: '/work/statistics-of-almost.html',
    tags: ['data', 'math'],
    date: '2025-12-09',
  },
  {
    title: 'How Neurons Decide',
    description:
      'A from-scratch look at the integrate-and-fire model and the threshold where a thought becomes a spike.',
    href: '/work/how-neurons-decide.html',
    tags: ['biology', 'data'],
    date: '2025-11-15',
  },
  {
    title: 'Entropy, Explained by Coffee',
    description:
      'Why your drink cools but never spontaneously reheats — the second law told through a single mug.',
    href: '/work/entropy-coffee.html',
    tags: ['physics', 'chemistry'],
    date: '2025-10-27',
  },
  {
    title: 'Drawing the Mandelbrot Set',
    description:
      'An interactive zoom into infinite complexity, rendered pixel by pixel in the browser.',
    href: '/work/mandelbrot.html',
    tags: ['math', 'interactive'],
    date: '2025-09-30',
  },
  {
    title: 'The Chemistry of Color',
    description:
      'Why copper burns green and sodium glows orange — electrons, energy levels, and flame tests.',
    href: '/work/chemistry-of-color.html',
    tags: ['chemistry', 'physics'],
    date: '2025-08-19',
  },
  {
    title: 'Simulating an Epidemic',
    description:
      'An SIR model you can poke at — watch how R0, vaccination, and timing reshape an outbreak curve.',
    href: '/work/simulating-epidemic.html',
    tags: ['biology', 'data', 'interactive'],
    date: '2025-07-22',
  },
  {
    title: 'Why the Sky Is Blue (and Sunsets Red)',
    description:
      'Rayleigh scattering, wavelength by wavelength, and the geometry that paints the horizon.',
    href: '/work/why-sky-is-blue.html',
    tags: ['physics', 'astronomy'],
    date: '2025-06-11',
  },
  {
    title: 'Sorting, Visualized',
    description:
      'Bubble, merge, quick, and heap — a side-by-side race of classic algorithms in motion.',
    href: '/work/sorting-visualized.html',
    tags: ['math', 'data', 'interactive'],
    date: '2025-05-03',
  },
  {
    title: 'The Carbon Cycle in Numbers',
    description:
      'Where the planet stores its carbon, how fast it moves, and what the fluxes actually add up to.',
    href: '/work/carbon-cycle.html',
    tags: ['chemistry', 'data'],
    date: '2025-04-08',
  },
  {
    title: 'A Short History of Zero',
    description:
      'From placeholder to number to the heart of calculus — how nothing became everything.',
    href: '/work/history-of-zero.html',
    tags: ['math'],
    date: '2025-03-14',
  },
];

/** Unique, sorted list of tags derived from all items. */
export const allTags = [...new Set(items.flatMap((i) => i.tags))].sort();
