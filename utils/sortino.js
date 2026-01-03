// utils/sortino.js
export function sortino(returns, riskFreeRate = 0, targetReturn = 0) {
  if (!returns.length) return 0;
  const excessReturns = returns.map(r => r - targetReturn);
  const avg = excessReturns.reduce((s, r) => s + r, 0) / returns.length;
  
  const downside = excessReturns.filter(r => r < 0);
  if (!downside.length) return Infinity;
  
  const downsideVariance = downside.reduce((s, r) => s + r * r, 0) / downside.length;
  const downsideDev = Math.sqrt(downsideVariance);
  
  return downsideDev === 0 ? Infinity : Number(((avg - riskFreeRate) / downsideDev).toFixed(3));
}
