// utils/unrealizedPnL.js
export function unrealizedPnL(position, currentPrice) {
  const cost = position.quantity * position.avgCost;
  const value = position.quantity * currentPrice;
  return Number((value - cost).toFixed(2));
}
