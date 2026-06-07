import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),
    // Optional: URL of an associated standalone app (e.g. an Observable
    // Framework build served from public/). The article is a normal Astro
    // route; this just lets the page surface a link to the app.
    // See docs/architecture.md, option 3.
    app: z.string().optional(),
  }),
});

export const collections = { work };
