import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { beforeAll, expect, it } from 'vitest';

beforeAll(() => {
  execFileSync('npm', ['run', 'build'], { stdio: 'pipe' });
}, 30000);

it('publishes Spanish articles with their public language URLs', () => {
  const feed = readFileSync('dist/es/feed.xml', 'utf8');
  expect(feed).toContain('La IA puede escribir tu código. Tú construyes tu reputación.');
  expect(feed).toContain('<link>https://kevinaleman.com/in-the-ai-era-code-is-cheap-reputation-isnt-3482/?lang=es</link>');
  expect(feed).not.toContain('In the AI Era, Code Is Cheap');
});

it('advertises the feed for the page language', () => {
  const spanish = readFileSync('dist/es/index.html', 'utf8');
  const english = readFileSync('dist/index.html', 'utf8');
  expect(spanish).toMatch(/type="application\/rss\+xml"[^>]*href="https:\/\/kevinaleman\.com\/es\/feed\.xml"/);
  expect(english).toMatch(/type="application\/rss\+xml"[^>]*href="https:\/\/kevinaleman\.com\/feed\.xml"/);
  expect(spanish).toMatch(/href="\/es\/feed\.xml"[^>]*>Suscribirse por RSS<\/a>/);
  expect(english).toMatch(/href="\/feed\.xml"[^>]*>Subscribe via RSS<\/a>/);
});
