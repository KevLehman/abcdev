import { getCollection } from 'astro:content';
import { articlePath } from '../lib/article-language.mjs';

export async function GET() {
  const articles = (await getCollection('articles', ({ data }) => !data.draft && !data.unlisted))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return new Response(JSON.stringify(articles.map((a) => ({
    slug: a.id,
    lang: a.data.lang,
    href: `${articlePath(a)}${a.data.lang === 'es' ? '?lang=es' : ''}`,
    idx: a.data.idx,
    date: a.data.date.toISOString().slice(0, 10),
    title: a.data.title,
    tags: a.data.tags,
    excerpt: a.data.excerpt,
    body: a.body ?? '',
  }))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
