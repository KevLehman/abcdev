export function searchArticles(entries, query) {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [...entries];

  return entries.map((entry) => {
    const title = entry.title.toLowerCase();
    const tags = entry.tags.join(' ').toLowerCase();
    const excerpt = entry.excerpt.toLowerCase();
    const body = (entry.body ?? '').toLowerCase();
    let score = 0;
    for (const token of tokens) {
      const match = title.startsWith(token) ? 5 : title.includes(token) ? 4
        : tags.includes(token) ? 3 : excerpt.includes(token) ? 2 : body.includes(token) ? 1 : 0;
      if (!match) return [0, entry];
      score += match;
    }
    return [score, entry];
  }).filter(([score]) => score > 0).sort((a, b) => b[0] - a[0]).map(([, entry]) => entry);
}
