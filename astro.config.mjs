import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import readingTime from './src/lib/reading-time.mjs';
import remarkEmbed from './src/lib/remark-embed.mjs';

export default defineConfig({
  site: 'https://abcdev.netlify.app',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
    // readingTime first so its word count ignores the injected card markup.
    remarkPlugins: [readingTime, remarkEmbed],
  },
});
