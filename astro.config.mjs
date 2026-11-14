import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import readingTime from './src/lib/reading-time.mjs';
import remarkEmbed from './src/lib/remark-embed.mjs';
import remarkFigures from './src/lib/remark-figures.mjs';
import { copyFile, readFile } from 'node:fs/promises';

let buildDirectory;

export default defineConfig({
  site: 'https://kevinaleman.com',
  integrations: [
    { name: 'sitemap-build-directory', hooks: {
      'astro:build:done': async ({ dir }) => {
        buildDirectory = dir;
        await copyFile(new URL('redirects.txt', dir), new URL('_redirects', dir));
      },
    } },
    sitemap({
      // Use the rendered robots directive as the source of truth for indexing.
      serialize: async (item) => {
        const path = new URL(item.url).pathname.replace(/\/?$/, '/');
        if (path.startsWith('/translations/')) return undefined;
        try {
          const html = await readFile(new URL(`.${path}index.html`, buildDirectory), 'utf8');
          return /<meta name="robots" content="noindex\b/.test(html) ? undefined : item;
        } catch (error) {
          if (error.code === 'ENOENT') return item;
          throw error;
        }
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
    // readingTime first so its word count ignores the injected card markup.
    remarkPlugins: [readingTime, remarkFigures, remarkEmbed],
  },
});
