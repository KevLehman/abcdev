// Builds an oEmbed (https://oembed.com) response for an article. We expose a
// `link`-type document per article so consumers (Slack, Discord, WordPress,
// Ghost, …) that discover the <link rel="alternate" type="application/json+oembed">
// tag in the article head can fetch a structured embed. Kept as a pure function so
// it is unit-testable and shared by the static endpoint.

const ENDPOINT = 'oembed'; // → /oembed/<slug>.json

export function oembedHref(slug, site) {
  return new URL(`${ENDPOINT}/${slug}.json`, site).href;
}

export function buildOembed({ title, thumbnailUrl } = {}, { site, author = 'Kevin Aleman', provider = 'ABCDev' } = {}) {
  const providerUrl = String(site).replace(/\/$/, '');
  const doc = {
    version: '1.0',
    type: 'link',
    title,
    author_name: author,
    author_url: providerUrl,
    provider_name: provider,
    provider_url: providerUrl,
    cache_age: 86400,
  };
  if (thumbnailUrl) doc.thumbnail_url = thumbnailUrl;
  return doc;
}
