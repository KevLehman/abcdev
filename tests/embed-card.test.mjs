import { describe, it, expect } from 'vitest';
import {
  EMBED_RE, discoverOembed, parseMeta, oembedToCard,
  normalizeCard, renderEmbedCard, hostname, fetchEmbed,
} from '../src/lib/embed-card.mjs';

describe('EMBED_RE', () => {
  it('matches a standalone liquid embed tag', () => {
    const m = '{% embed https://daniel.haxx.se/blog/x/ %}'.match(EMBED_RE);
    expect(m?.[1]).toBe('https://daniel.haxx.se/blog/x/');
  });
  it('tolerates loose whitespace', () => {
    expect('{%   embed    https://a.com  %}'.match(EMBED_RE)?.[1]).toBe('https://a.com');
  });
  it('ignores prose that merely mentions embed', () => {
    expect('you can embed https://a.com in a post'.match(EMBED_RE)).toBeNull();
  });
});

describe('discoverOembed', () => {
  it('finds and absolutizes the json oembed endpoint', () => {
    const html = `<link rel="alternate" type="application/json+oembed" href="/oembed?url=x">`;
    expect(discoverOembed(html, 'https://site.tld/post')).toBe('https://site.tld/oembed?url=x');
  });
  it('ignores xml oembed and returns null when absent', () => {
    const html = `<link rel="alternate" type="text/xml+oembed" href="/x">`;
    expect(discoverOembed(html, 'https://site.tld')).toBeNull();
  });
});

describe('parseMeta', () => {
  it('prefers Open Graph, decodes entities, and falls back to <title>', () => {
    const html = `
      <title>Ignored &amp; Co</title>
      <meta property="og:title" content="Death &amp; Slop">
      <meta name="description" content="A post">
      <meta property="og:image" content="https://site.tld/a.png">
      <meta property="og:site_name" content="Daniel">`;
    expect(parseMeta(html)).toEqual({
      title: 'Death & Slop', description: 'A post',
      image: 'https://site.tld/a.png', provider: 'Daniel',
    });
  });
  it('uses <title> when no og:title', () => {
    expect(parseMeta('<title>Just Title</title>').title).toBe('Just Title');
  });
});

describe('normalizeCard', () => {
  it('fills missing fields from the URL host and absolutizes the image', () => {
    const card = normalizeCard({ image: '/thumb.png' }, 'https://www.example.com/a');
    expect(card).toEqual({
      url: 'https://www.example.com/a', title: 'example.com', description: '',
      image: 'https://www.example.com/thumb.png', provider: 'example.com',
    });
  });
});

describe('oembedToCard', () => {
  it('maps oembed fields onto the card shape', () => {
    expect(oembedToCard({ title: 'T', thumbnail_url: 'i', provider_name: 'GitHub' }))
      .toEqual({ title: 'T', description: undefined, image: 'i', provider: 'GitHub' });
  });
});

describe('renderEmbedCard', () => {
  it('renders an escaped anchor with provider, title, desc and thumb', () => {
    const html = renderEmbedCard({
      url: 'https://a.com/x?y=1&z=2', provider: 'a.com',
      title: 'Hello <b>', description: 'Desc', image: 'https://a.com/i.png',
    });
    expect(html).toContain('href="https://a.com/x?y=1&amp;z=2"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('Hello &lt;b&gt;');
    expect(html).toContain('embed-card__desc');
    expect(html).toContain('src="https://a.com/i.png"');
  });
  it('omits the thumb and desc when absent', () => {
    const html = renderEmbedCard({ url: 'https://a.com', provider: 'a.com', title: 'T', description: '', image: '' });
    expect(html).not.toContain('embed-card__thumb');
    expect(html).not.toContain('embed-card__desc');
  });
});

describe('hostname', () => {
  it('strips www and tolerates junk', () => {
    expect(hostname('https://www.example.com/a')).toBe('example.com');
    expect(hostname('not a url')).toBe('not a url');
  });
});

describe('fetchEmbed', () => {
  const res = (body, ok = true, json) => ({ ok, text: async () => body, json: async () => json });

  it('resolves via oembed discovery when advertised', async () => {
    const page = `<link rel="alternate" type="application/json+oembed" href="https://api.tld/o">`;
    const fetchImpl = async (url) => url === 'https://api.tld/o'
      ? res('', true, { title: 'Gist', thumbnail_url: 'https://t/i.png', provider_name: 'GitHub' })
      : res(page);
    const card = await fetchEmbed('https://gist.github.com/x', { fetchImpl });
    expect(card.title).toBe('Gist');
    expect(card.provider).toBe('GitHub');
  });

  it('falls back to page metadata when no oembed endpoint', async () => {
    const fetchImpl = async () => res('<meta property="og:title" content="Blog Post">');
    const card = await fetchEmbed('https://blog.tld/p', { fetchImpl });
    expect(card.title).toBe('Blog Post');
    expect(card.provider).toBe('blog.tld');
  });

  it('degrades to a host-only card when the fetch fails', async () => {
    const fetchImpl = async () => { throw new Error('offline'); };
    const card = await fetchEmbed('https://down.tld/p', { fetchImpl });
    expect(card).toEqual({ url: 'https://down.tld/p', title: 'down.tld', description: '', image: '', provider: 'down.tld' });
  });
});
