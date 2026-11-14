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
});
