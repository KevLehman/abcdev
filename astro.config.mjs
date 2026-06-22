import { defineConfig } from 'astro/config';
import readingTime from './src/lib/reading-time.mjs';

export default defineConfig({
  site: 'https://abcdev.netlify.app',
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
    remarkPlugins: [readingTime],
  },
});
