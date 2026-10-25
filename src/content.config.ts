import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The article engine (fek/fek-daily-tweet/src/engine) writes these files. The
// schema is the last gate before production: a malformed file fails the build,
// so it never reaches the live site. Keep it in step with engine/store.py.

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const fekId = z.string().regex(/^\d{11}$/);

const timelineEntry = z.object({
  date: isoDate,
  fek: fekId,
  label: z.string().min(1),
  kind: z.enum(['origin', 'amends', 'implements', 'related']),
  summary: z.string().min(1),
  quote: z.string(),
  pdf: z.string().url(),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1).max(160),
    summary: z.string(),
    tracked_acts: z.array(z.string()),
    topics: z.array(z.string()),
    status: z.enum(['published', 'draft', 'stub']),
    created: isoDate,
    updated: isoDate,
    timeline: z.array(timelineEntry).min(1),
    verify_errors: z.array(z.string()).optional(),
  }),
});

const digest = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/digest' }),
  schema: z.object({
    date: isoDate,
    entries: z.array(
      z.object({
        fek: fekId,
        label: z.string(),
        line: z.string().min(1),
        newsworthiness: z.number().int().min(0).max(10),
        route: z.enum(['new', 'update', 'digest']),
        article: z.string().nullable(),
        pdf: z.string().url(),
      }),
    ),
  }),
});

export const collections = { articles, digest };
