import { describe, it, expect } from 'vitest';
import { serializeStructuredData } from '../src/lib/structured-data.mjs';

const page = {
  site: new URL('https://kevinaleman.com/'),
  canonicalURL: new URL('https://kevinaleman.com/a-post'),
  description: 'An entry from the logbook.',
  ogImageURL: 'https://kevinaleman.com/og/a-post.png',
};
const article = {
  title: 'A post',
  publishedTime: new Date('2020-05-10T17:12:33.962Z'),
  tags: ['postgresql', 'sql'],
};

describe('serializeStructuredData', () => {
  it('connects the personal site to its owner and existing profiles', () => {
    const doc = JSON.parse(serializeStructuredData(page));
    expect(doc['@context']).toBe('https://schema.org');
    const person = doc['@graph'].find((node) => node['@type'] === 'Person');
    const website = doc['@graph'].find((node) => node['@type'] === 'WebSite');
    expect(person).toMatchObject({
      '@id': 'https://kevinaleman.com/#kevin-aleman',
      name: 'Kevin Aleman',
      url: 'https://kevinaleman.com/',
      jobTitle: 'Backend Engineer',
      sameAs: [
        'https://dev.to/kaleman15',
        'https://github.com/KevLehman',
        'https://twitter.com/kaleman15',
        'https://www.facebook.com/k.alemangarcia',
      ],
    });
    expect(website).toMatchObject({
      url: 'https://kevinaleman.com/',
      publisher: { '@id': person['@id'] },
    });
    expect(doc['@graph'].some((node) => node['@type'] === 'BlogPosting')).toBe(false);
  });

  it('uses real article metadata and links its author and canonical page', () => {
    const doc = JSON.parse(serializeStructuredData({ ...page, article }));
    const post = doc['@graph'].find((node) => node['@type'] === 'BlogPosting');
    expect(post).toMatchObject({
      headline: 'A post',
      description: 'An entry from the logbook.',
      url: 'https://kevinaleman.com/a-post',
      datePublished: '2020-05-10T17:12:33.962Z',
      author: { '@id': 'https://kevinaleman.com/#kevin-aleman' },
      image: 'https://kevinaleman.com/og/a-post.png',
      keywords: ['postgresql', 'sql'],
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://kevinaleman.com/a-post' },
    });
    expect(post).not.toHaveProperty('dateModified');
  });

  it('keeps script terminators inert while preserving the original text as JSON', () => {
    const title = 'Code </script><script>alert("x")</script> & types';
    const description = 'Quotes " and newlines\nwith <html> and \u2028 separators.';
    const serialized = serializeStructuredData({
      ...page, description, article: { ...article, title },
    });
    expect(serialized).not.toContain('<');
    const post = JSON.parse(serialized)['@graph'].find((node) => node['@type'] === 'BlogPosting');
    expect(post.headline).toBe(title);
    expect(post.description).toBe(description);
  });

  it('does not describe noindex pages as public entities or articles', () => {
    expect(serializeStructuredData({ ...page, noindex: true })).toBeNull();
    expect(serializeStructuredData({ ...page, article, noindex: true })).toBeNull();
  });
});
