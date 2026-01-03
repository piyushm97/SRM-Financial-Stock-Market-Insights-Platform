// utils/valueAtRisk.js
export function valueAtRisk(returns, confidence = 0.95) {
  if (!returns.length) return 0;
  const sorted = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sorted.length);
  return Number(sorted[index].toFixed(4));
}
