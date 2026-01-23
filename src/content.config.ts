import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
    featuredImage: z.string().optional(),
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
