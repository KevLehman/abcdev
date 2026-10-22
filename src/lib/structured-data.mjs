export const socialProfiles = [
  { href: 'https://dev.to/kaleman15', label: 'dev.to' },
  { href: 'https://github.com/KevLehman', label: 'github' },
  { href: 'https://twitter.com/kaleman15', label: 'twitter' },
  { href: 'https://www.facebook.com/k.alemangarcia', label: 'facebook' },
];

/**
 * @param {{ site: URL, canonicalURL: URL, description: string, ogImageURL: string,
 *   article?: { title: string, publishedTime: Date, tags: string[] }, noindex?: boolean }} page
 */
export function serializeStructuredData({ site, canonicalURL, description, ogImageURL, article, noindex }) {
  if (noindex) return null;

  const person = {
    '@type': 'Person',
    '@id': new URL('#kevin-aleman', site).href,
    name: 'Kevin Aleman',
    url: site.href,
    jobTitle: 'Backend Engineer',
    sameAs: socialProfiles.map(({ href }) => href),
  };
  const website = {
    '@type': 'WebSite',
    '@id': new URL('#website', site).href,
    name: "Kev's logbook",
    url: site.href,
    publisher: { '@id': person['@id'] },
  };
  const graph = [person, website];
  if (article) {
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${canonicalURL.href}#article`,
      headline: article.title,
      description,
      url: canonicalURL.href,
      datePublished: article.publishedTime.toISOString(),
      author: { '@id': person['@id'] },
      image: ogImageURL,
      keywords: article.tags,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalURL.href },
      isPartOf: { '@id': website['@id'] },
    });
  }
  // Escape HTML's script delimiter without changing the JSON values.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}
