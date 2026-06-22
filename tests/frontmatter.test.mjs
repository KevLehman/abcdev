import { describe, it, expect } from 'vitest';
import { normalizeTags } from '../src/lib/frontmatter.mjs';

describe('normalizeTags', () => {
  it('splits a comma string into trimmed array', () => {
    expect(normalizeTags('golang, javascript, tutorial')).toEqual(['golang', 'javascript', 'tutorial']);
  });
  it('passes arrays through, trimming and dropping empties', () => {
    expect(normalizeTags(['go', ' js ', ''])).toEqual(['go', 'js']);
  });
  it('returns [] for nullish', () => {
    expect(normalizeTags(undefined)).toEqual([]);
  });
});
