export function articlePath(article) {
  return `/${article.data.lang === 'es' ? (!article.data.unlisted && article.data.translationOf) || article.id.replace(/^es\//, '') : article.id}/`;
}

/**
 * @template {{ id: string, data: { lang: string, translationOf?: string, draft?: boolean, unlisted?: boolean } }} T
 * @param {T} article
 * @param {T[]} articles
 * @returns {T | undefined}
 */
export function translationFor(article, articles) {
  return articles.find((other) => !other.data.draft && !other.data.unlisted && !article.data.unlisted &&
    (article.data.lang === 'es'
      ? other.data.lang === 'en' && other.id === article.data.translationOf
      : other.data.lang === 'es' && other.data.translationOf === article.id));
}
