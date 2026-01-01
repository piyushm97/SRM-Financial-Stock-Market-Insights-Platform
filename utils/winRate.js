// utils/winRate.js
export function winRate(trades) {
  if (!trades.length) return 0;
  const wins = trades.filter(t => t.pnl > 0).length;
  return Number(((wins / trades.length) * 100).toFixed(2));
}
