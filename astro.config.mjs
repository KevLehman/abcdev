import { defineConfig } from 'astro/config';
import readingTime from './src/lib/reading-time.mjs';
import remarkEmbed from './src/lib/remark-embed.mjs';

export default defineConfig({
  site: 'https://abcdev.netlify.app',
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
    // readingTime first so its word count ignores the injected card markup.
    remarkPlugins: [readingTime, remarkEmbed],
  },
});
