// Remark plugin: turn a paragraph that is *only* an external link into a rendered
// link card. Two forms qualify:
//   • a dev.to `{% embed <url> %}` Liquid tag, and
//   • a lone link — a bare URL or `[text](url)` sitting alone in its paragraph.
// A lone link is skipped when it labels an adjacent list (next block is a list) or
// lives inside a list item, so compact "link + bullet notes" lists stay intact.
// Runs at build time; fetched cards are cached per-URL for the process so
// `astro dev` re-renders stay cheap.
import { toString } from 'mdast-util-to-string';
import { EMBED_RE, fetchEmbed, renderEmbedCard } from './embed-card.mjs';

const cache = new Map();

function resolve(url) {
  if (!cache.has(url)) cache.set(url, fetchEmbed(url));
  return cache.get(url);
}

function loneLinkUrl(paragraph) {
  const kids = (paragraph.children || []).filter((c) => !(c.type === 'text' && c.value.trim() === ''));
  if (kids.length === 1 && kids[0].type === 'link' && /^https?:\/\//i.test(kids[0].url)) return kids[0].url;
  return null;
}

function embeddableUrl(paragraph, next) {
  const tag = toString(paragraph).trim().match(EMBED_RE);
  if (tag) return tag[1];
  const link = loneLinkUrl(paragraph);
  if (link && !(next && next.type === 'list')) return link;
  return null;
}

export function collectEmbeds(tree) {
  const hits = [];
  const walk = (node) => {
    const children = node.children;
    if (!Array.isArray(children)) return;
    children.forEach((child, index) => {
      if (child.type === 'paragraph' && node.type !== 'listItem') {
        const url = embeddableUrl(child, children[index + 1]);
        if (url) { hits.push({ parent: children, index, url }); return; }
      }
      walk(child);
    });
  };
  walk(tree);
  return hits;
}

export default function remarkEmbed() {
  return async function (tree) {
    const hits = collectEmbeds(tree);
    if (hits.length === 0) return;
    const cards = await Promise.all(hits.map((h) => resolve(h.url)));
    hits.forEach(({ parent, index }, i) => {
      parent[index] = { type: 'html', value: renderEmbedCard(cards[i]) };
    });
  };
}
