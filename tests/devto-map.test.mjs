import { describe, it, expect } from 'vitest';
import { mapDevtoArticle, isolateEmbeds } from '../src/lib/devto.mjs';

const sample = {
  title: 'My Post',
  slug: 'my-post-123',
  description: 'A short summary.',
  published_at: '2021-05-01T10:00:00Z',
  tag_list: ['node', 'sql'],
  cover_image: 'https://example.com/cover.png',
  url: 'https://dev.to/kaleman15/my-post-123',
  body_markdown: '# Hello\n\nBody text.',
};

describe('mapDevtoArticle', () => {
  it('maps API fields to frontmatter with blog as canonical and dev.to as mirror', () => {
    const out = mapDevtoArticle(sample, { idx: 11, siteUrl: 'https://abcdev.netlify.app' });
    expect(out.slug).toBe('my-post-123');
    expect(out.frontmatter.idx).toBe(11);
    expect(out.frontmatter.title).toBe('My Post');
    expect(out.frontmatter.tags).toEqual(['node', 'sql']);
    expect(out.frontmatter.excerpt).toBe('A short summary.');
    expect(out.frontmatter.canonicalUrl).toBe('https://abcdev.netlify.app/my-post-123');
    expect(out.frontmatter.devtoUrl).toBe('https://dev.to/kaleman15/my-post-123');
    expect(out.body).toContain('Body text.');
  });
});

describe('isolateEmbeds', () => {
  it('surrounds an embed glued to the previous line with blank lines', () => {
    expect(isolateEmbeds('read more:\n{% embed https://a.com %}'))
      .toBe('read more:\n\n{% embed https://a.com %}\n');
  });
  it('leaves prose that merely mentions embed untouched', () => {
    const md = 'you can embed https://a.com inline';
    expect(isolateEmbeds(md)).toBe(md);
  });
});
