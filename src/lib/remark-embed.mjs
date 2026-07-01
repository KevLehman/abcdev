// Remark plugin: replace standalone `{% embed <url> %}` paragraphs (a Liquid tag
// carried over from dev.to) with a rendered link card. Runs at build time; fetched
// cards are cached per-URL for the process so `astro dev` re-renders stay cheap.
import { toString } from 'mdast-util-to-string';
import { EMBED_RE, fetchEmbed, renderEmbedCard } from './embed-card.mjs';

const cache = new Map();

function resolve(url) {
  if (!cache.has(url)) cache.set(url, fetchEmbed(url));
  return cache.get(url);
}

function collectEmbeds(tree) {
  const hits = [];
  const walk = (node) => {
    const children = node.children;
    if (!Array.isArray(children)) return;
    children.forEach((child, index) => {
      const match = child.type === 'paragraph' && toString(child).trim().match(EMBED_RE);
      if (match) hits.push({ parent: children, index, url: match[1] });
      else walk(child);
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
