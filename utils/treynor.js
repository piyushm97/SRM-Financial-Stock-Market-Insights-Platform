// utils/treynor.js
export function treynor(portfolioReturn, riskFreeRate, beta) {
  if (beta === 0) return Infinity;
  return Number(((portfolioReturn - riskFreeRate) / beta).toFixed(3));
}
