import { getCollection } from 'astro:content';

export async function GET() {
  const articles = (await getCollection('articles', ({ data }) => !data.draft && !data.unlisted))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return new Response(JSON.stringify(articles.map((a) => ({
    slug: a.id,
    idx: a.data.idx,
    date: a.data.date.toISOString().slice(0, 10),
    title: a.data.title,
    tags: a.data.tags,
    excerpt: a.data.excerpt,
    body: a.body ?? '',
  }))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
