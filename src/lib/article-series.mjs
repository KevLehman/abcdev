/**
 * Build navigation from published parts in their explicit reading order.
 * @template {{ id: string, data: { draft?: boolean, series?: { id: string, title: string, order: number } } }} T
 * @param {T} current
 * @param {T[]} articles
 */
export function getArticleSeries(current, articles) {
  const series = current.data.series;
  if (!series || current.data.draft) return null;

  const parts = articles
    .filter((article) => !article.data.draft && article.data.series?.id === series.id)
    .sort((a, b) => a.data.series.order - b.data.series.order || a.id.localeCompare(b.id));
  const index = parts.findIndex((article) => article.id === current.id);
  if (parts.length < 2 || index === -1) return null;

  return {
    title: series.title,
    articles: parts,
    position: index + 1,
    previous: parts[index - 1] ?? null,
    next: parts[index + 1] ?? null,
  };
}
