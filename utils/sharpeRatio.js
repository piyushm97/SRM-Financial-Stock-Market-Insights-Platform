// utils/sharpeRatio.js
export function sharpeRatio(returns, riskFreeRate = 0) {
  if (!returns.length) return 0;
  const avg =
    returns.reduce((s, r) => s + r, 0) / returns.length;
  const variance =
    returns.reduce((s, r) => s + Math.pow(r - avg, 2), 0) /
    returns.length;
  const stdDev = Math.sqrt(variance || 1);
  return Number(((avg - riskFreeRate) / stdDev).toFixed(3));
}
