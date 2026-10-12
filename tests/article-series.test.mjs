import { describe, it, expect } from 'vitest';
import { getArticleSeries } from '../src/lib/article-series.mjs';

const article = (id, order, options = {}) => ({
  id,
  data: {
    title: id,
    draft: false,
    series: { id: 'js-to-go', title: 'From JavaScript to Go', order },
    ...options,
  },
});

describe('getArticleSeries', () => {
  it('excludes unlisted parts from links and counts and hides navigation on an unlisted article', () => {
    const first = article('first', 1);
    const unlisted = article('unlisted', 2, { unlisted: true });
    const last = article('last', 3);
    const entries = [first, unlisted, last];
    expect(getArticleSeries(first, entries)).toMatchObject({
      articles: [first, last], position: 1, next: last,
    });
    expect(getArticleSeries(last, entries)).toMatchObject({ position: 2, previous: first, next: null });
    expect(getArticleSeries(unlisted, entries)).toBeNull();
  });

  it('orders parts by explicit order and finds the current part and neighbors', () => {
    const first = article('first', 1);
    const current = article('second', 2);
    const last = article('third', 3);
    const entries = [last, first, current];

    expect(getArticleSeries(current, entries)).toEqual({
      title: 'From JavaScript to Go',
      articles: [first, current, last],
      position: 2,
      previous: first,
      next: last,
    });
    expect(entries).toEqual([last, first, current]);
  });

  it('does not wrap previous and next links at the ends of a series', () => {
    const first = article('first', 1);
    const last = article('last', 2);
    const entries = [last, first];

    expect(getArticleSeries(first, entries)).toMatchObject({ position: 1, previous: null, next: last });
    expect(getArticleSeries(last, entries)).toMatchObject({ position: 2, previous: first, next: null });
  });

  it('excludes drafts and other series from the parts, count, and next link', () => {
    const current = article('first', 1);
    const draft = article('unpublished', 2, { draft: true });
    const next = article('third', 3);
    const other = article('unrelated', 2, { series: { id: 'other', title: 'Other', order: 2 } });
    const standalone = article('standalone', 2, { series: undefined });

    expect(getArticleSeries(current, [other, draft, next, standalone, current])).toEqual({
      title: 'From JavaScript to Go',
      articles: [current, next],
      position: 1,
      previous: null,
      next,
    });
  });

  it('uses the public article ID to identify the current part', () => {
    const first = article('first', 1);
    const current = article('second', 2);
    expect(getArticleSeries({ ...current }, [first, current])).toMatchObject({ position: 2, previous: first });
  });

  it.each([
    ['office', 'o\uFB03ce'],
    ['A', '\uFF21'],
  ])('keeps distinct routes %s and %s separate even when NFKC would match them', (firstId, secondId) => {
    const first = article(firstId, 1);
    const second = article(secondId, 2);
    const entries = [second, first];
    expect(getArticleSeries(first, entries)).toMatchObject({
      position: 1, previous: null, next: second,
    });
    expect(getArticleSeries(second, entries)).toMatchObject({
      position: 2, previous: first, next: null,
    });
  });

  it('sorts double-digit reading orders numerically', () => {
    const first = article('first', 1);
    const second = article('second', 2);
    const tenth = article('tenth', 10);
    expect(getArticleSeries(second, [tenth, second, first])).toMatchObject({
      articles: [first, second, tenth], position: 2, previous: first, next: tenth,
    });
  });

  it('counts published parts rather than authored order when a draft leaves a gap', () => {
    const first = article('first', 1);
    const draft = article('draft', 2, { draft: true });
    const last = article('last', 3);
    expect(getArticleSeries(last, [last, draft, first])).toMatchObject({
      articles: [first, last], position: 2, previous: first, next: null,
    });
  });

  it('rejects duplicate published orders with the series and conflicting entries', () => {
    const first = article('first', 1);
    const duplicate = article('duplicate', 1);
    expect(() => getArticleSeries(first, [first, duplicate])).toThrow(/js-to-go.*order 1.*first.*duplicate/);
  });

  it('rejects conflicting published titles with the series and conflicting entries', () => {
    const first = article('first', 1);
    const conflict = article('conflict', 2, { series: { id: 'js-to-go', title: 'Other title', order: 2 } });
    expect(() => getArticleSeries(first, [first, conflict])).toThrow(/js-to-go.*title.*first.*conflict/);
  });

  it('does not validate draft metadata against published series parts', () => {
    const first = article('first', 1);
    const last = article('last', 2);
    const draft = article('draft', 1, { draft: true, series: { id: 'js-to-go', title: 'Working title', order: 1 } });
    expect(getArticleSeries(first, [draft, last, first])).toMatchObject({ articles: [first, last], next: last });
  });

  it('omits navigation for standalone posts, drafts, and a single published part', () => {
    const first = article('first', 1);
    const draft = article('draft', 2, { draft: true });
    expect(getArticleSeries(article('standalone', 1, { series: undefined }), [first])).toBeNull();
    expect(getArticleSeries(draft, [first, draft])).toBeNull();
    expect(getArticleSeries(first, [first, draft])).toBeNull();
    expect(getArticleSeries(article('missing', 3), [first, article('second', 2)])).toBeNull();
  });
});
