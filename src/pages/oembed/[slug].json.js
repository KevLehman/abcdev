import { getCollection } from 'astro:content';
import { buildOembed } from '../../lib/oembed.mjs';

export async function getStaticPaths() {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.map((article) => ({ params: { slug: article.slug }, props: { article } }));
}

export async function GET({ props, site }) {
  const { data } = props.article;
  const thumb = data.featuredImage?.src ?? data.coverImage;
  const thumbnailUrl = thumb ? new URL(thumb, site).href : undefined;
  const doc = buildOembed({ title: data.title, thumbnailUrl }, { site });
  return new Response(JSON.stringify(doc), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
