/**
 * Build navigation from published parts in their explicit reading order.
 * @template {{ id: string, data: { draft?: boolean, unlisted?: boolean, series?: { id: string, title: string, order: number } } }} T
 * @param {T} current
 * @param {T[]} articles
 */
export function getArticleSeries(current, articles) {
  const series = current.data.series;
  if (!series || current.data.draft || current.data.unlisted) return null;

  const parts = articles
    .filter((article) => !article.data.draft && !article.data.unlisted && article.data.series?.id === series.id)
    .sort((a, b) => a.data.series.order - b.data.series.order);
  const orders = new Map();
  for (const part of parts) {
    const previous = orders.get(part.data.series.order);
    if (previous) {
      throw new Error(`Series "${series.id}" repeats order ${part.data.series.order}: "${previous.id}" and "${part.id}".`);
    }
    if (part.data.series.title !== series.title) {
      throw new Error(`Series "${series.id}" has conflicting titles: "${current.id}" and "${part.id}".`);
    }
    orders.set(part.data.series.order, part);
  }
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
