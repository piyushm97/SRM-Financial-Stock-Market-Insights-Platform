// utils/movingAverage.js
export function sma(values, period) {
  if (values.length < period) return [];
  const result = [];
  for (let i = period - 1; i < values.length; i++) {
    const slice = values.slice(i - period + 1, i + 1);
    const avg = slice.reduce((s, v) => s + v, 0) / period;
    result.push(Number(avg.toFixed(4)));
  }
  return result;
}
