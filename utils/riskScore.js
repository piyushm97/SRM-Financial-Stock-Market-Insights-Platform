// utils/riskScore.js
export function riskScore(beta, volatility) {
  const b = Math.abs(beta ?? 1);
  const v = volatility ?? 0;
  const raw = b * 0.6 + v * 0.4;
  return Math.min(10, Number(raw.toFixed(2)));
}
