export function normalizeTags(raw) {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : String(raw).split(',');
  return arr.map((t) => t.trim()).filter(Boolean);
}

export function assignIdx(dates) {
  const order = dates
    .map((d, i) => ({ i, t: d.getTime() }))
    .sort((a, b) => a.t - b.t);
  const idx = new Array(dates.length);
  order.forEach((o, rank) => { idx[o.i] = rank + 1; });
  return idx;
}
