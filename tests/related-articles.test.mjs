import { describe, it, expect } from 'vitest';
import { pickRelatedArticle } from '../src/lib/related-articles.mjs';

const article = (id, tags, date = '2026-01-01', draft = false) => ({
  id, data: { tags, date: new Date(date), draft },
});

describe('pickRelatedArticle', () => {
  it('never recommends an unlisted article, even when it is the best match', () => {
    const current = article('current', ['go']);
    const unlisted = article('unlisted', ['go'], '2026-10-12');
    unlisted.data.unlisted = true;
    const listed = article('listed', ['sql']);
    expect(pickRelatedArticle(current, [unlisted, listed])).toBe(listed);
    expect(pickRelatedArticle(current, [unlisted])).toBeNull();
  });

  it('prefers more shared topics over recency', () => {
    const current = article('current', ['postgresql', 'sql']);
    const close = article('close', ['sql', 'postgresql'], '2020-01-01');
    const recent = article('recent', ['sql'], '2026-10-01');
    expect(pickRelatedArticle(current, [recent, close])).toBe(close);
  });

  it('breaks equal relevance by recency without changing the collection order', () => {
    const current = article('current', ['go']);
    const older = article('older', ['go'], '2020-01-01');
    const newer = article('newer', ['go'], '2026-01-01');
    const entries = [older, newer];
    expect(pickRelatedArticle(current, entries)).toBe(newer);
    expect(entries).toEqual([older, newer]);
  });

  it('falls back to the latest published entry and excludes the current entry and drafts', () => {
    const current = article('current', [], '2026-10-11');
    const draft = article('draft', [], '2026-10-12', true);
    const latest = article('latest', ['vim'], '2026-10-01');
    expect(pickRelatedArticle(current, [current, draft, article('older', ['sql']), latest])).toBe(latest);
  });

  it('counts each shared tag once', () => {
    const current = article('current', ['sql', 'postgresql']);
    const duplicate = article('duplicate', ['sql', 'sql', 'sql'], '2026-10-01');
    const related = article('related', ['sql', 'postgresql'], '2020-01-01');
    expect(pickRelatedArticle(current, [duplicate, related])).toBe(related);
  });

  it('uses the slug as a stable tie breaker', () => {
    const current = article('current', ['go']);
    const first = article('a', ['go']);
    const second = article('b', ['go']);
    expect(pickRelatedArticle(current, [second, first])).toBe(first);
    expect(pickRelatedArticle(current, [first, second])).toBe(first);
  });

  it('omits the recommendation when no other published entry exists', () => {
    const current = article('current', ['go']);
    expect(pickRelatedArticle(current, [])).toBeNull();
    expect(pickRelatedArticle(current, [current, article('draft', ['go'], undefined, true)])).toBeNull();
  });
});
