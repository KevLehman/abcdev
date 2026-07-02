// Build-time branded share cards, one per article: the logbook masthead, the
// entry's log line (idx · date · read time), and its title. Rendered with satori
// (flexbox layout from plain object trees) and rasterized by resvg, using the
// same fonts and design tokens as the site itself. public/og-default.png is the
// hand-kept equivalent for pages that aren't articles — keep the two in sync if
// the brand changes.
import { getCollection, render } from 'astro:content';
import { readFile } from 'node:fs/promises';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const BONE = '#EFEFEA';
const GRAPHITE = '#15181B';
const SLATE = '#565C63';
const HAIRLINE = '#D5D6D0';
const SIGNAL = '#2347FF';

const fontFile = (pkg, file) =>
  readFile(new URL(`../../../node_modules/@fontsource/${pkg}/files/${file}`, import.meta.url));

const fonts = Promise.all([
  fontFile('space-grotesk', 'space-grotesk-latin-700-normal.woff').then((data) => ({
    name: 'Space Grotesk', weight: 700, style: 'normal', data,
  })),
  fontFile('space-grotesk', 'space-grotesk-latin-500-normal.woff').then((data) => ({
    name: 'Space Grotesk', weight: 500, style: 'normal', data,
  })),
  fontFile('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff').then((data) => ({
    name: 'JetBrains Mono', weight: 400, style: 'normal', data,
  })),
]);

const el = (type, style, ...children) => ({
  type,
  props: { style, children: children.length === 1 ? children[0] : children },
});

function card({ idx, date, minutes, title, tags }) {
  const titleSize = title.length > 55 ? 58 : title.length > 34 ? 70 : 82;
  return el('div', {
    display: 'flex', flexDirection: 'column', width: '1200px', height: '630px',
    padding: '0 72px', backgroundColor: BONE, color: GRAPHITE,
  },
    el('div', {
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '40px 0 28px', borderBottom: `2px solid ${HAIRLINE}`,
    },
      el('div', { display: 'flex', fontFamily: 'Space Grotesk', fontSize: '30px', letterSpacing: '0.02em' },
        el('span', { fontWeight: 700 }, 'KEVIN ALEMAN'),
        el('span', { fontWeight: 500, color: SLATE, marginLeft: '12px' }, '— LOGBOOK'),
      ),
      el('div', { display: 'flex', fontFamily: 'JetBrains Mono', fontSize: '22px', color: SLATE }, 'abcdev.netlify.app'),
    ),
    el('div', { display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' },
      el('div', { display: 'flex', fontFamily: 'JetBrains Mono', fontSize: '22px', letterSpacing: '0.1em' },
        el('span', { color: SIGNAL }, `// LOG ${String(idx).padStart(3, '0')}`),
        el('span', { color: SLATE, marginLeft: '18px' }, `· ${date} · ${minutes}M READ`),
      ),
      el('div', {
        display: 'flex', marginTop: '28px', fontFamily: 'Space Grotesk', fontWeight: 700,
        fontSize: `${titleSize}px`, lineHeight: 1.06, letterSpacing: '-0.02em',
      }, title),
    ),
    el('div', {
      display: 'flex', justifyContent: 'space-between', padding: '26px 0 40px',
      borderTop: `2px solid ${HAIRLINE}`, fontFamily: 'JetBrains Mono', fontSize: '20px', color: SLATE,
    },
      el('span', {}, tags.slice(0, 4).join(' · ')),
      el('span', {}, 'by Kevin Aleman'),
    ),
  );
}

export async function getStaticPaths() {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.map((article) => ({ params: { slug: article.id }, props: { article } }));
}

export async function GET({ props }) {
  const { article } = props;
  const { remarkPluginFrontmatter } = await render(article);
  const svg = await satori(card({
    idx: article.data.idx,
    date: article.data.date.toISOString().slice(0, 10),
    minutes: parseInt(remarkPluginFrontmatter.minutesRead ?? '1', 10) || 1,
    title: article.data.title,
    tags: article.data.tags,
  }), { width: 1200, height: 630, fonts: await fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
