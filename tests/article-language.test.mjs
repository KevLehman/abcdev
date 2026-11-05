import { describe, expect, it } from 'vitest';
import { articlePath, translationFor } from '../src/lib/article-language.mjs';

const english = { id: 'hello', data: { lang: 'en' } };
const spanish = { id: 'es/hola', data: { lang: 'es', translationOf: 'hello' } };

describe('article languages', () => {
  it('uses one article path for both translations', () => {
    expect(articlePath(english)).toBe('/hello/');
    expect(articlePath(spanish)).toBe('/hello/');
    expect(articlePath({ id: 'es/solo', data: { lang: 'es' } })).toBe('/solo/');
    expect(articlePath({ id: 'es/privado', data: { lang: 'es', translationOf: 'hello', unlisted: true } })).toBe('/privado/');
  });

  it('only links published, listed translations in either direction', () => {
    expect(translationFor(english, [spanish])).toBe(spanish);
    expect(translationFor(spanish, [english])).toBe(english);
    expect(translationFor(english, [{ ...spanish, data: { ...spanish.data, draft: true } }])).toBeUndefined();
    expect(translationFor({ ...english, data: { ...english.data, unlisted: true } }, [spanish])).toBeUndefined();
  });
});
