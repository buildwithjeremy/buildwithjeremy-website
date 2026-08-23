import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    featuredImage: z.string().optional(),

    // --- AEO fields ---
    // The literal question a reader types, with a self-contained 40-60 word answer.
    // Rendered above the article body and written so it survives being lifted out
    // and pasted into a chat window alone. Measured 2026-08-22: top-of-funnel
    // educational answers in this shape are what Perplexity cites.
    quickAnswer: z
      .object({
        question: z.string(),
        answer: z.string(),
      })
      .optional(),
    // Becomes FAQPage JSON-LD. Each answer must also stand alone out of context.
    faqs: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    client: z.string().optional(),
    description: z.string().optional(),
    industry: z.string().optional(),
    publishDate: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    featuredImage: z.string().optional(),
    results: z.array(z.object({
      metric: z.string(),
      value: z.string(),
    })).optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string().optional(),
    description: z.string().optional(),
    price: z.string().optional(),
    featured: z.boolean().default(true),
    order: z.number().default(0),
    featuredImage: z.string().optional(),
    benefits: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    resourceType: z.enum(['guide', 'template', 'checklist', 'ebook', 'video']).default('guide'),
    gated: z.boolean().default(true),
    downloadUrl: z.string().url().optional(),
    featuredImage: z.string().optional(),
  }),
});

export const collections = { blog, portfolio, services, resources };
