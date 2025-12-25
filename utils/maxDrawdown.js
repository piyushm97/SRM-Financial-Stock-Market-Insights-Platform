// utils/maxDrawdown.js
export function maxDrawdown(values) {
  let peak = -Infinity;
  let maxDD = 0;
  values.forEach((v) => {
    if (v > peak) peak = v;
    const dd = (peak - v) / peak;
    if (dd > maxDD) maxDD = dd;
  });
  return Number((maxDD * 100).toFixed(2)); // percent
}
