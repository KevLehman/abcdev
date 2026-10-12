import { it, expect } from 'vitest';
import { matchArticle, sync } from '../scripts/sync-devto.mjs';
const article = { id: 1, title: 'A post', slug: 'dev-slug', url: 'https://dev.to/kaleman15/dev-slug', canonical_url: null, user: { username: 'kaleman15' } };
const post = { title: 'A post', path: '/local-slug', devtoUrl: article.url };

it('prefers explicit DEV links and refuses ambiguous or conflicting matches and drafts', () => {
  expect(matchArticle(article, [post])).toBe(post);
  expect(matchArticle(article, [post, { ...post }])).toBeNull();
  expect(matchArticle(article, [{ ...post, devtoUrl: 'https://dev.to/kaleman15/other' }])).toBeNull();
  expect(matchArticle(article, [{ ...post, draft: true }])).toBeNull();
  expect(matchArticle(article, [{ ...post, unlisted: true }])).toBeNull();
  expect(matchArticle({ ...article, title: 'Unrelated' }, [{ ...post, devtoUrl: undefined }])).toBeNull();
  expect(matchArticle({ ...article, canonical_url: 'https://kaleman.netlify.app/local-slug' }, [{ ...post, devtoUrl: undefined }])?.path).toBe('/local-slug');
});

function mockFetch({ invalid = false } = {}) {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push({ url, options });
    if (options.method === 'PUT') return Response.json({ canonical_url: 'https://kevinaleman.com/local-slug' });
    if (url.includes('/api/')) return Response.json(url.includes('page=1') ? [article] : []);
    const response = new Response('article', { status: invalid ? 404 : 200, headers: { 'content-type': 'text/html' } });
    Object.defineProperty(response, 'url', { value: url });
    return response;
  };
  return { calls, fetcher };
}

it('paginates and verifies targets without writes in default mode or leaking auth to the blog', async () => {
  const { calls, fetcher } = mockFetch();
  const rows = await sync({ key: 'test', posts: [post], fetcher, log: () => {} });
  expect(rows[0].status).toBe('UPDATE');
  expect(calls.filter((c) => c.options.method === 'PUT')).toHaveLength(0);
  expect(calls.at(-1).options.headers).toBeUndefined();
  expect(calls.some((c) => c.url.includes('page=2'))).toBe(true);
});

it('apply sends only canonical_url; invalid targets are never updated', async () => {
  for (const invalid of [false, true]) {
    const { calls, fetcher } = mockFetch({ invalid });
    await sync({ key: 'test', posts: [post], apply: true, fetcher, log: () => {} });
    const writes = calls.filter((c) => c.options.method === 'PUT');
    expect(writes).toHaveLength(invalid ? 0 : 1);
    if (!invalid) expect(JSON.parse(writes[0].options.body)).toEqual({ article: { canonical_url: 'https://kevinaleman.com/local-slug' } });
  }
});
