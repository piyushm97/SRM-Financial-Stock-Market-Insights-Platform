// utils/sharpeByPeriod.js
export function sharpeByPeriod(returns, periodsPerYear = 252) {
  if (!returns.length) return 0;
  const avg = returns.reduce((s, r) => s + r, 0) / returns.length;
  const variance = returns.reduce((s, r) => s + Math.pow(r - avg, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance * periodsPerYear);
  const annualReturn = avg * periodsPerYear;
  return stdDev === 0 ? 0 : Number((annualReturn / stdDev).toFixed(3));
}
