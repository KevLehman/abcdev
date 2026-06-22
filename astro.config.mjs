import { defineConfig } from 'astro/config';
import readingTime from './src/lib/reading-time.mjs';

export default defineConfig({
  site: 'https://abcdev.netlify.app',
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
    remarkPlugins: [readingTime],
  },
});
