// utils/profitFactor.js
export function profitFactor(trades) {
  const grossProfit = trades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0);
  const grossLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((s, t) => s + t.pnl, 0));
  return grossLoss === 0 ? Infinity : Number((grossProfit / grossLoss).toFixed(2));
}
