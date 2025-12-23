// server/src/utils/dailySummary.js
export function dailySummary(positions) {
  let totalValue = 0;
  let todaysPnL = 0;

  positions.forEach((p) => {
    const value = p.quantity * p.lastPrice;
    const pnl = (p.lastPrice - p.prevClose) * p.quantity;
    totalValue += value;
    todaysPnL += pnl;
  });

  return {
    totalValue: Number(totalValue.toFixed(2)),
    todaysPnL: Number(todaysPnL.toFixed(2))
  };
}
