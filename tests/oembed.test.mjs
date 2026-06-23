import { describe, it, expect } from 'vitest';
import { buildOembed, oembedHref } from '../src/lib/oembed.mjs';

const site = 'https://abcdev.netlify.app';

describe('buildOembed', () => {
  it('builds a spec-compliant link-type document', () => {
    const doc = buildOembed({ title: 'My Post' }, { site });
    expect(doc.version).toBe('1.0');
    expect(doc.type).toBe('link');
    expect(doc.title).toBe('My Post');
    expect(doc.provider_name).toBe("Kev's logbook");
    expect(doc.provider_url).toBe(site);
    expect(doc.author_name).toBe('Kevin Aleman');
    expect('thumbnail_url' in doc).toBe(false);
  });

  it('includes a thumbnail when one is provided', () => {
    const doc = buildOembed({ title: 'P', thumbnailUrl: `${site}/_astro/x.webp` }, { site });
    expect(doc.thumbnail_url).toBe(`${site}/_astro/x.webp`);
  });

  it('tolerates a trailing slash on the site', () => {
    const doc = buildOembed({ title: 'P' }, { site: `${site}/` });
    expect(doc.provider_url).toBe(site);
  });
});

describe('oembedHref', () => {
  it('points at the per-article json endpoint', () => {
    expect(oembedHref('the-beauty-of-node-streams', site))
      .toBe(`${site}/oembed/the-beauty-of-node-streams.json`);
  });
});
