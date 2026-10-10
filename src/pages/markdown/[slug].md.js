import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.map((article) => ({ params: { slug: article.id }, props: { article } }));
}

export function GET({ props, site }) {
  const { article } = props;
  const original = new URL(`/${article.id}`, site).href;
  const markdown = [
    `# ${article.data.title}`,
    '',
    'Author: Kevin Aleman',
    `Published: ${article.data.date.toISOString().slice(0, 10)}`,
    `Original: ${original}`,
    '',
    '---',
    '',
    article.body,
  ].join('\n');
  return new Response(markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
