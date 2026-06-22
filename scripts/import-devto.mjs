import { writeFile, readdir, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { mapDevtoArticle } from '../src/lib/devto.mjs';

const API = 'https://dev.to/api';
const KEY = process.env.DEVTO_API_KEY;          // optional — public username fetch works without it
const USERNAME = process.env.DEVTO_USERNAME ?? 'kaleman15';
const SITE = process.env.SITE_URL ?? 'https://abcdev.netlify.app';
const FORCE = process.argv.includes('--force');
const OUT = path.resolve('src/content/articles');
const authHeaders = KEY ? { 'api-key': KEY } : {};

// With an API key we list our own (incl. drafts); without one we use the public
// per-username endpoint, which only returns published articles.
const listUrl = (page) => KEY
  ? `${API}/articles/me/published?per_page=30&page=${page}`
  : `${API}/articles?username=${USERNAME}&per_page=30&page=${page}`;

function toYaml(fm) {
  const esc = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
  const lines = [];
  for (const [k, v] of Object.entries(fm)) {
    if (Array.isArray(v)) lines.push(`${k}: [${v.map(esc).join(', ')}]`);
    else if (typeof v === 'number' || typeof v === 'boolean') lines.push(`${k}: ${v}`);
    else lines.push(`${k}: ${esc(v)}`);
  }
  return lines.join('\n');
}

const normTitle = (t) => String(t).toLowerCase().replace(/\s+/g, ' ').trim();

async function scanExisting() {
  const files = (await readdir(OUT)).filter((f) => f.endsWith('.md'));
  let maxIdx = 0;
  const titles = new Set();
  const devtoUrls = new Set();
  for (const f of files) {
    const text = await readFile(path.join(OUT, f), 'utf8');
    const idx = text.match(/^idx:\s*(\d+)/m);
    if (idx) maxIdx = Math.max(maxIdx, Number(idx[1]));
    const title = text.match(/^title:\s*"?(.+?)"?\s*$/m);
    if (title) titles.add(normTitle(title[1]));
    const dev = text.match(/^devtoUrl:\s*"?([^"]+?)"?\s*$/m);
    if (dev) devtoUrls.add(dev[1]);
  }
  return { maxIdx, titles, devtoUrls };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const { maxIdx, titles, devtoUrls } = await scanExisting();
  let nextIdx = maxIdx + 1;
  let page = 1, written = 0, skipped = 0;
  console.log(KEY ? 'mode: authenticated (me/published)' : `mode: public (username=${USERNAME})`);

  while (true) {
    const res = await fetch(listUrl(page), { headers: authHeaders });
    if (!res.ok) { console.error(`dev.to API ${res.status}`); process.exit(1); }
    const list = await res.json();
    if (list.length === 0) break;

    for (const summary of list) {
      // Skip already-known articles from the cheap list summary, before spending
      // a per-article request (keeps re-runs under the rate limit).
      if (!FORCE && summary.slug && existsSync(path.join(OUT, `${summary.slug}.md`))) {
        console.log(`skip  ${summary.slug} (file exists)`); skipped++; continue;
      }
      if (!FORCE && summary.url && devtoUrls.has(summary.url)) {
        console.log(`skip  ${summary.slug} (already migrated: ${summary.url})`); skipped++; continue;
      }

      const r = await fetch(`${API}/articles/${summary.id}`, { headers: authHeaders });
      if (!r.ok) { console.warn(`skip  ${summary.id}: dev.to API ${r.status}`); continue; }
      const full = await r.json();
      const { slug, frontmatter, body } = mapDevtoArticle(full, { idx: nextIdx, siteUrl: SITE });
      const file = path.join(OUT, `${slug}.md`);
      if (!FORCE && existsSync(file)) { console.log(`skip  ${slug} (file exists)`); skipped++; continue; }
      if (!FORCE && titles.has(normTitle(frontmatter.title))) {
        console.log(`skip  ${slug} (title already migrated under a different slug)`); skipped++; continue;
      }
      titles.add(normTitle(frontmatter.title));
      if (frontmatter.devtoUrl) devtoUrls.add(frontmatter.devtoUrl);
      await writeFile(file, `---\n${toYaml(frontmatter)}\n---\n\n${body}\n`);
      console.log(`write ${slug} (idx ${nextIdx})`);
      nextIdx++; written++;
      await new Promise((res) => setTimeout(res, 400)); // be gentle with the dev.to rate limit
    }
    page++;
  }
  console.log(`done — ${written} written, ${skipped} skipped`);
}
main();
