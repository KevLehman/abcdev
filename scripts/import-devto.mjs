import { writeFile, readdir, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { mapDevtoArticle } from '../src/lib/devto.mjs';

const API = 'https://dev.to/api';
const KEY = process.env.DEVTO_API_KEY;
const SITE = process.env.SITE_URL ?? 'https://abcdev.netlify.app';
const FORCE = process.argv.includes('--force');
const OUT = path.resolve('src/content/articles');

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

async function currentMaxIdx() {
  const files = (await readdir(OUT)).filter((f) => f.endsWith('.md'));
  let max = 0;
  for (const f of files) {
    const m = (await readFile(path.join(OUT, f), 'utf8')).match(/^idx:\s*(\d+)/m);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max;
}

async function main() {
  if (!KEY) { console.error('Set DEVTO_API_KEY'); process.exit(1); }
  await mkdir(OUT, { recursive: true });
  let nextIdx = (await currentMaxIdx()) + 1;
  let page = 1, written = 0, skipped = 0;

  while (true) {
    const res = await fetch(`${API}/articles/me/published?per_page=30&page=${page}`, {
      headers: { 'api-key': KEY },
    });
    if (!res.ok) { console.error(`dev.to API ${res.status}`); process.exit(1); }
    const list = await res.json();
    if (list.length === 0) break;

    for (const summary of list) {
      const r = await fetch(`${API}/articles/${summary.id}`, { headers: { 'api-key': KEY } });
      if (!r.ok) { console.warn(`skip  ${summary.id}: dev.to API ${r.status}`); continue; }
      const full = await r.json();
      const { slug, frontmatter, body } = mapDevtoArticle(full, { idx: nextIdx, siteUrl: SITE });
      const file = path.join(OUT, `${slug}.md`);
      if (existsSync(file) && !FORCE) { console.log(`skip  ${slug}`); skipped++; continue; }
      await writeFile(file, `---\n${toYaml(frontmatter)}\n---\n\n${body}\n`);
      console.log(`write ${slug} (idx ${nextIdx})`);
      nextIdx++; written++;
    }
    page++;
  }
  console.log(`done — ${written} written, ${skipped} skipped`);
}
main();
