import { describe, it, expect } from 'vitest';
import { collectEmbeds } from '../src/lib/remark-embed.mjs';

const text = (value) => ({ type: 'text', value });
const link = (url, label = url) => ({ type: 'link', url, children: [text(label)] });
const para = (...children) => ({ type: 'paragraph', children });
const root = (...children) => ({ type: 'root', children });
const list = () => ({ type: 'list', children: [{ type: 'listItem', children: [para(text('note'))] }] });

const urls = (tree) => collectEmbeds(tree).map((h) => h.url);

describe('collectEmbeds', () => {
  it('matches a liquid embed tag paragraph', () => {
    expect(urls(root(para(text('{% embed https://a.com %}'))))).toEqual(['https://a.com']);
  });

  it('matches a lone markdown link paragraph', () => {
    expect(urls(root(para(link('https://hackerone.com/reports/1', 'HackerOne report')))))
      .toEqual(['https://hackerone.com/reports/1']);
  });

  it('matches a lone bare-url (autolink) paragraph', () => {
    expect(urls(root(para(link('https://a.com'))))).toEqual(['https://a.com']);
  });

  it('leaves a link that labels an adjacent list', () => {
    expect(urls(root(para(link('https://a.com', 'a-lib')), list()))).toEqual([]);
  });

  it('leaves inline links inside a sentence', () => {
    expect(urls(root(para(text('see '), link('https://a.com'), text(' for more'))))).toEqual([]);
  });

  it('leaves links inside list items', () => {
    const li = { type: 'listItem', children: [para(link('https://a.com'))] };
    expect(urls(root({ type: 'list', children: [li] }))).toEqual([]);
  });

  it('ignores non-http links', () => {
    expect(urls(root(para(link('mailto:me@a.com'))))).toEqual([]);
    expect(urls(root(para(link('#anchor'))))).toEqual([]);
  });

  it('finds embeds nested in a blockquote', () => {
    expect(urls(root({ type: 'blockquote', children: [para(link('https://a.com'))] })))
      .toEqual(['https://a.com']);
  });
});
