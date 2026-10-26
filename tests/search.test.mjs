import { describe, expect, it } from 'vitest';
import { searchArticles } from '../src/lib/search.mjs';

const entries = [
  { title: 'Streams', tags: ['node'], excerpt: 'A guide', body: 'Backpressure keeps memory in check.' },
  { title: 'Backpressure basics', tags: [], excerpt: 'An introduction', body: 'More detail.' },
];

describe('article search', () => {
  it('finds words in article bodies and ranks title matches first', () => {
    expect(searchArticles(entries, 'backpressure')).toEqual([entries[1], entries[0]]);
  });

  it('requires every search term to match and handles case', () => {
    expect(searchArticles(entries, 'NODE memory')).toEqual([entries[0]]);
    expect(searchArticles(entries, 'node missing')).toEqual([]);
    expect(searchArticles(entries, '')).toEqual(entries);
  });
});
