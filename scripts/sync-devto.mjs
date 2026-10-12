import { setTimeout as delay } from 'node:timers/promises';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';

const SITE = 'https://kevinaleman.com';
const API = 'https://dev.to/api';
const normalizeTitle = (s) => String(s).normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
const urlPath = (s) => {
  try {
    const u = new URL(s);
    return ['kevinaleman.com', 'kaleman.netlify.app'].includes(u.hostname)
      ? u.pathname.replace(/\/$/, '') : null;
  } catch { return null; }
};

export function matchArticle(article, posts) {
  const eligible = posts.filter((p) => !p.draft && !p.unlisted);
  const stages = [
    (p) => p.devtoUrl === article.url,
    (p) => urlPath(article.canonical_url) === p.path,
    (p) => `/${article.slug}` === p.path,
    (p) => normalizeTitle(p.title) === normalizeTitle(article.title),
  ];
  for (const matches of stages) {
    const candidates = eligible.filter(matches);
    if (candidates.length > 1) return null;
    if (candidates.length === 1) {
      const post = candidates[0];
      // Never override an explicit link to a different DEV article.
      if (post.devtoUrl && post.devtoUrl !== article.url) return null;
      return post;
    }
  }
  return null;
}

export async function sync({ key, posts, apply = false, fetcher = fetch, log = console.log }) {
  if (!key) throw new Error('Set DEVTO_API_KEY in the environment or ignored .env file.');
  const headers = { 'api-key': key, Accept: 'application/vnd.forem.api-v1+json' };
  const request = async (path, options = {}) => {
    const response = await fetcher(`${API}${path}`, {
      ...options, headers: { ...headers, ...options.headers },
      redirect: 'error', signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`DEV API returned HTTP ${response.status}.`);
    return response.json();
  };
  const articles = [];
  const ids = new Set();
  for (let page = 1; ; page++) {
    const batch = await request(`/articles/me/all?per_page=30&page=${page}`);
    if (!Array.isArray(batch)) throw new Error('Unexpected DEV article list.');
    if (!batch.length) break;
    for (const article of batch) {
      if (!Number.isSafeInteger(article.id) || ids.has(article.id)) {
        throw new Error('Invalid or repeated article ID; rerun when the article list is stable.');
      }
      ids.add(article.id);
      articles.push(article);
    }
  }
  if (articles.some((a) => a.user?.username !== 'kaleman15')) {
    throw new Error('API key account does not match kaleman15.');
  }
  const plans = articles.map((article) => ({ article, post: matchArticle(article, posts) }));
  const results = [];
  for (const { article, post } of plans) {
    const proposed = post ? `${SITE}${post.path}` : null;
    let status = 'UNMATCHED';
    if (post && plans.filter((p) => p.post === post).length === 1) {
      status = 'INVALID TARGET';
      try {
        // No auth headers ever go to the blog. Reject redirects/soft-404 home pages.
        const target = await fetcher(proposed, { redirect: 'follow', signal: AbortSignal.timeout(30000) });
        const final = new URL(target.url);
        const valid = target.ok && final.origin === SITE &&
          final.pathname.replace(/\/$/, '') === post.path && !final.search &&
          target.headers.get('content-type')?.includes('text/html');
        if (valid) status = article.canonical_url === proposed ? 'OK' : 'UPDATE';
      } catch { /* Network failures are invalid targets, never permission to write. */ }
    }
    const row = { title: article.title, id: article.id, current: article.canonical_url ?? null, proposed, status };
    results.push(row);
    log(JSON.stringify(row));
  }
  if (apply) {
    for (const row of results.filter((r) => r.status === 'UPDATE')) {
      await delay(3500); // Pace writes to avoid Forem's update rate limit.
      const updated = await request(`/articles/${row.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: { canonical_url: row.proposed } }),
      });
      if (updated.canonical_url !== row.proposed) throw new Error(`Canonical update not confirmed for article ${row.id}.`);
      log(`UPDATED ${row.id}`);
    }
  }
  return results;
}

async function main() {
  if (process.argv.slice(2).some((arg) => arg !== '--apply')) throw new Error('Usage: npm run devto:sync -- [--apply]');
  const root = new URL('../src/content/articles/', import.meta.url);
  const files = await readdir(root, { recursive: true });
  const posts = [];
  for (const file of files.filter((f) => f.endsWith('.md'))) {
    const { frontmatter: data } = parseFrontmatter(await readFile(new URL(file, root), 'utf8'));
    const slug = typeof data.slug === 'string' && data.slug ? data.slug : file.replace(/\.md$/, '');
    const path = `/${slug}`;
    if (new URL(path, SITE).origin !== SITE || new URL(path, SITE).pathname !== path || /[?#]/.test(path)) {
      throw new Error(`Invalid local route in ${file}.`);
    }
    posts.push({ ...data, path });
  }
  console.log(process.argv.includes('--apply') ? 'APPLY MODE' : 'DRY RUN — no DEV writes');
  await sync({ key: process.env.DEVTO_API_KEY, posts, apply: process.argv.includes('--apply') });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    // Never dump request objects, response bodies, or errors containing credentials.
    if (/^(DEV API returned HTTP \d{3}\.|Canonical update not confirmed for article \d+\.)$/.test(error.message)) console.error(error.message);
    console.error('Sync failed. Check DEVTO_API_KEY, account, network, and API availability. No further updates attempted.');
    process.exitCode = 1;
  });
}
