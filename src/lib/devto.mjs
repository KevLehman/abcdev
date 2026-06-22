import { normalizeTags } from './frontmatter.mjs';

export function mapDevtoArticle(a, { idx, siteUrl }) {
  const slug = a.slug;
  const frontmatter = {
    idx,
    title: a.title,
    date: a.published_at,
    slug,
    tags: normalizeTags(a.tag_list),
    excerpt: a.description?.trim() || a.title,
    draft: false,
    featured: false,
    canonicalUrl: `${siteUrl.replace(/\/$/, '')}/${slug}`,
    devtoUrl: a.url,
    ...(a.cover_image ? { coverImage: a.cover_image } : {}),
  };
  return { slug, frontmatter, body: a.body_markdown ?? '' };
}
