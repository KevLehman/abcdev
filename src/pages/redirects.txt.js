import { getCollection } from 'astro:content';
import { articlePath, translationFor } from '../lib/article-language.mjs';

export async function GET({ site }) {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  const rules = articles.filter((article) => article.data.lang === 'es' && translationFor(article, articles))
    .map((article) => {
      const path = articlePath(article);
      return `${new URL(path, site).href} lang=es /translations${path} 200!`;
    });
  return new Response(rules.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
