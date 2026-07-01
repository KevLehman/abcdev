// Turns a bare URL into a rich "link card" for inline embedding. dev.to articles
// use Liquid `{% embed <url> %}` tags; on import those survive as literal text, so
// we strip the tag and render our own card instead. Resolution order mirrors the
// oEmbed spec (https://oembed.com): discover a provider's oEmbed endpoint from the
// page's <link rel="alternate" type="application/json+oembed">, and fall back to
// Open Graph / Twitter / <title> metadata when no endpoint is advertised. Pure and
// fetch-injectable so the parsing is unit-testable without the network.

export const EMBED_RE = /^\{%\s*embed\s+(\S+)\s*%\}$/;

const UA = 'Mozilla/5.0 (compatible; KevLogbook/1.0; +https://abcdev.netlify.app)';

const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'" };

function decodeEntities(str) {
  return String(str).replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, code) => {
    if (code[0] === '#') {
      const cp = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : m;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? m;
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

export function hostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

// Find a provider's JSON oEmbed endpoint from a discovery <link>, resolved against
// the page URL so relative hrefs work.
export function discoverOembed(html, baseUrl) {
  for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
    if (!/type\s*=\s*["']application\/json\+oembed["']/i.test(tag)) continue;
    const href = (tag.match(/\bhref\s*=\s*["']([^"']+)["']/i) || [])[1];
    if (!href) continue;
    try {
      return new URL(decodeEntities(href), baseUrl).href;
    } catch {
      return decodeEntities(href);
    }
  }
  return null;
}

function parseMetaTags(html) {
  const map = {};
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const key = (tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i) || [])[1];
    const val = (tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i) || [])[1];
    if (key && val != null) map[key.toLowerCase()] = decodeEntities(val);
  }
  return map;
}

// Card fields from a page's HTML `<head>`, preferring Open Graph, then Twitter,
// then the plain document title / meta description.
export function parseMeta(html) {
  const m = parseMetaTags(html);
  const rawTitle = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  return {
    title: m['og:title'] || m['twitter:title'] || (rawTitle && decodeEntities(rawTitle.trim())) || undefined,
    description: m['og:description'] || m['twitter:description'] || m['description'] || undefined,
    image: m['og:image'] || m['og:image:url'] || m['twitter:image'] || m['twitter:image:src'] || undefined,
    provider: m['og:site_name'] || undefined,
  };
}

// Map a fetched oEmbed document onto our card shape.
export function oembedToCard(doc) {
  return {
    title: doc.title || undefined,
    description: doc.description || undefined,
    image: doc.thumbnail_url || undefined,
    provider: doc.provider_name || doc.author_name || undefined,
  };
}

// Fill gaps with sensible URL-derived defaults so a card is always renderable.
export function normalizeCard(partial, url) {
  const host = hostname(url);
  return {
    url,
    title: partial.title || host,
    description: partial.description || '',
    image: partial.image ? absoluteUrl(partial.image, url) : '',
    provider: partial.provider || host,
  };
}

function absoluteUrl(maybeRelative, baseUrl) {
  try {
    return new URL(maybeRelative, baseUrl).href;
  } catch {
    return maybeRelative;
  }
}

export function renderEmbedCard(card) {
  const href = escapeHtml(card.url);
  const provider = escapeHtml(card.provider);
  const title = escapeHtml(card.title);
  const desc = card.description ? `<span class="embed-card__desc">${escapeHtml(card.description)}</span>` : '';
  const thumb = card.image
    ? `<img class="embed-card__thumb" src="${escapeHtml(card.image)}" alt="" loading="lazy" decoding="async" />`
    : '';
  return (
    `<a class="embed-card" href="${href}" target="_blank" rel="noopener noreferrer">` +
      `<span class="embed-card__text">` +
        `<span class="embed-card__provider">${provider}</span>` +
        `<span class="embed-card__title">${title}</span>` +
        desc +
      `</span>` +
      thumb +
    `</a>`
  );
}

// Resolve a URL to a normalized card. Tries oEmbed discovery, then page metadata,
// then a minimal host-only card. Never throws — an unreachable or hostile page
// still yields a link the reader can follow. `fetchImpl` is injectable for tests.
export async function fetchEmbed(url, { fetchImpl = fetch } = {}) {
  try {
    const res = await fetchImpl(url, { headers: { 'user-agent': UA, accept: 'text/html' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const oembedUrl = discoverOembed(html, url);
    if (oembedUrl) {
      try {
        const or = await fetchImpl(oembedUrl, { headers: { 'user-agent': UA, accept: 'application/json' } });
        if (or.ok) {
          const card = normalizeCard(oembedToCard(await or.json()), url);
          if (card.title !== hostname(url)) return card;
        }
      } catch { /* fall through to metadata */ }
    }
    return normalizeCard(parseMeta(html), url);
  } catch {
    return normalizeCard({}, url);
  }
}
