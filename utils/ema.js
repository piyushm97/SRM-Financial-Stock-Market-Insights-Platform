// utils/ema.js
export function ema(values, period) {
  if (!Array.isArray(values) || values.length === 0 || period <= 0) return [];
  const k = 2 / (period + 1);
  const result = [];
  let prev;

  values.forEach((v, i) => {
    const price = Number(v);
    if (i === 0) {
      prev = price;
    } else {
      prev = price * k + prev * (1 - k);
    }
    result.push(Number(prev.toFixed(4)));
  });

  return result;
}
