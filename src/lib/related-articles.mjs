/**
 * Prefer shared topics, then recent posts, with a stable tie breaker.
 * @template {{ id: string, data: { tags: string[], date: Date, draft?: boolean, unlisted?: boolean } }} T
 * @param {T} current
 * @param {T[]} articles
 * @returns {T | null}
 */
export function pickRelatedArticle(current, articles) {
  const tags = new Set(current.data.tags);
  return articles
    .filter((article) => article.id !== current.id && !article.data.draft && !article.data.unlisted)
    .map((article) => ({
      article,
      shared: [...new Set(article.data.tags)].filter((tag) => tags.has(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared
      || b.article.data.date.getTime() - a.article.data.date.getTime()
      || a.article.id.localeCompare(b.article.id))[0]?.article ?? null;
}
