import { normalizeTags } from './frontmatter.mjs';

// dev.to `{% embed <url> %}` tags are block-level, but authors sometimes glue them
// to an adjacent line. Isolate each onto its own paragraph so our embed remark
// plugin (which matches standalone paragraphs) can turn it into a link card.
export function isolateEmbeds(md) {
  return md.replace(/^[ \t]*(\{%\s*embed\s+\S+\s*%\})[ \t]*$/gm, '\n$1\n');
}

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
  return { slug, frontmatter, body: isolateEmbeds(a.body_markdown ?? '') };
}
