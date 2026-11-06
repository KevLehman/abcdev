import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { articlePath } from '../../lib/article-language.mjs';

export async function GET(context) {
  const articles = (await getCollection('articles', ({ data }) => !data.draft && !data.unlisted && data.lang === 'es'))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return rss({
    title: 'Bitácora de Kevin Aleman',
    description: 'Una bitácora sobre código, juegos y vida.',
    site: context.site,
    customData: '<language>es</language>',
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.excerpt,
      link: new URL(`${articlePath(article)}?lang=es`, context.site).href,
    })),
  });
}
