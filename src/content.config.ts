import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const articles = defineCollection({
  // The entry id is the public URL path. `slug` frontmatter wins (it preserves
  // the URLs of imported/migrated posts — never change it on existing articles),
  // with the filename as the fallback for new local posts.
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/articles',
    generateId: ({ entry, data }) =>
      typeof data.slug === 'string' && data.slug ? data.slug : entry.replace(/\.md$/, ''),
  }),
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
  // Single-document JSON: wrap the file's object as the one entry, id "talks".
  loader: file('src/content/talks/talks.json', {
    parser: (text) => [{ id: 'talks', ...JSON.parse(text) }],
  }),
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
