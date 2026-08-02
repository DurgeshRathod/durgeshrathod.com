import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content collections. Case studies and notes are MDX so prose can embed the
 * interactive components (architecture diagrams, callouts) without leaving markdown.
 */

const work = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    /** Shorter headline for cards and lists. */
    cardTitle: z.string().optional(),
    description: z.string(),
    published: z.string(),
    updated: z.string().optional(),
    /** Ordering on the index — lower first. */
    order: z.number().default(99),
    /** The one number this case study is remembered for. */
    headlineStat: z.object({
      value: z.string(),
      label: z.string(),
    }),
    role: z.string(),
    /** Rendered as a fact table, and as schema.org keywords. */
    stack: z.array(z.string()),
    pillars: z.array(z.enum(['reliability', 'cost', 'observability'])),
    keywords: z.array(z.string()).default([]),
    /** Pulled out as a highlighted block — the honest bit that makes it credible. */
    whatBroke: z.string(),
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.string(),
    updated: z.string().optional(),
    /** Question-shaped headings that this note answers directly — used for FAQ schema. */
    faq: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
    keywords: z.array(z.string()).default([]),
    readingMinutes: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, notes };
