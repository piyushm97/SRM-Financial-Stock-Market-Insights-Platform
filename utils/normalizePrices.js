// utils/normalizePrices.js
export function normalizePrices(values) {
  if (!values.length) return [];
  const base = values[0] || 1;
  return values.map((v) => Number(((v / base) * 100).toFixed(2)));
}
