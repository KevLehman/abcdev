import { describe, expect, it } from 'vitest';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkFigures from '../src/lib/remark-figures.mjs';

describe('article figures', () => {
  it('renders marked Markdown as labeled figures and preserves their content', async () => {
    const processor = await createMarkdownProcessor({ remarkPlugins: [remarkFigures], syntaxHighlight: false });
    const { code } = await processor.render('> [!TIMELINE] Release\n>\n> - Mar: **Build**\n> - Apr: Ship\n\n> [!NOTE] Caution\n>\n> Read [the docs](/docs).');
    expect(code).toContain('class="article-figure article-figure--timeline"');
    expect(code).toContain('Release</p>');
    expect(code).toContain('<strong>Build</strong>');
    expect(code).toContain('class="article-figure article-figure--note"');
    expect(code).toContain('<a href="/docs">the docs</a>');
  });

  it('leaves ordinary quotes and unknown markers alone', async () => {
    const processor = await createMarkdownProcessor({ remarkPlugins: [remarkFigures], syntaxHighlight: false });
    const { code } = await processor.render('> A quote.\n\n> [!OTHER] Keep this.');
    expect(code).toContain('<blockquote>');
    expect(code).toContain('[!OTHER] Keep this.');
    expect(code).not.toContain('article-figure');
  });

  it('renders additional content and diagram types', async () => {
    const processor = await createMarkdownProcessor({ remarkPlugins: [remarkFigures], syntaxHighlight: false });
    const markdown = ['QUOTE', 'TERMINAL', 'FLOW', 'TREE', 'BOARD', 'STAT', 'SPEC', 'CHECK', 'DIFF', 'COMPARE', 'DECISION', 'CHAT', 'ENV', 'ENDPOINT', 'KEYS', 'FAQ', 'CHANGELOG'].map((type) => `> [!${type}] Example\n>\n> Sample content`).join('\n\n');
    const { code } = await processor.render(markdown);
    for (const type of ['quote', 'terminal', 'flow', 'tree', 'board', 'stat', 'spec', 'check', 'diff', 'compare', 'decision', 'chat', 'env', 'endpoint', 'keys', 'faq', 'changelog']) {
      expect(code).toContain(`article-figure--${type}`);
    }
  });

  it('draws bars from rank and meter values while retaining readable values', async () => {
    const processor = await createMarkdownProcessor({ remarkPlugins: [remarkFigures], syntaxHighlight: false });
    const { code } = await processor.render('> [!RANK] Downloads\n>\n> - App: 10\n> - Docs: 5\n\n> [!METER] Progress\n>\n> 75% complete');
    expect(code).toContain('article-figure--rank');
    expect(code).toContain('████████████████████');
    expect(code).toContain('██████████░░░░░░░░░░');
    expect(code).toContain('App: 10');
    expect(code).toContain('███████████████░░░░░');
    expect(code).toContain('75% complete');
    expect(code).toContain('aria-hidden="true"');
  });

  it('leaves invalid or negative chart values as text', async () => {
    const processor = await createMarkdownProcessor({ remarkPlugins: [remarkFigures], syntaxHighlight: false });
    const { code } = await processor.render('> [!RANK]\n>\n> - loss: -4\n\n> [!METER]\n>\n> 150%');
    expect(code).toContain('loss: -4');
    expect(code).toContain('150%');
    expect(code).not.toContain('article-figure__bar');
  });

  it('draws sparklines and hundred-cell charts from supplied numbers', async () => {
    const processor = await createMarkdownProcessor({ remarkPlugins: [remarkFigures], syntaxHighlight: false });
    const { code } = await processor.render('> [!SPARK] Load\n>\n> 1 2 3\n\n> [!WAFFLE] Coverage\n>\n> 50% covered');
    expect(code).toContain('▁▄█');
    expect(code).toContain('1 2 3');
    expect(code).toContain('50% covered');
    expect((code.match(/█/g) ?? []).length).toBe(51);
    expect((code.match(/░/g) ?? []).length).toBe(50);
  });

  it('handles zero, constant and malformed values without misleading graphics', async () => {
    const processor = await createMarkdownProcessor({ remarkPlugins: [remarkFigures], syntaxHighlight: false });
    const { code } = await processor.render('> [!RANK]\n>\n> - A: 0\n> - B: 0\n\n> [!SPARK]\n>\n> 4 4 4\n\n> [!WAFFLE]\n>\n> 101%\n\n> [!RANK]\n>\n> - A: 2\n> - B: -1');
    expect(code).toContain('░░░░░░░░░░░░░░░░░░░░');
    expect(code).toContain('▁▁▁');
    expect((code.match(/class="article-figure__bar"/g) ?? []).length).toBe(3);
  });
});
