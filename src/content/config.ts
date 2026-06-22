import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    idx: z.number().int(),
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    featuredImage: image().optional(),
    coverImage: z.string().url().optional(),
    tweet: z.string().optional(),
    canonicalUrl: z.string().url().optional(),
    devtoUrl: z.string().url().optional(),
  }),
});

const talks = defineCollection({
  type: 'data',
  schema: z.object({
    talks: z.array(z.object({
      title: z.string(),
      date: z.coerce.date(),
      event: z.string(),
      url: z.string().url().optional(),
    })),
  }),
});

export const collections = { articles, talks };
