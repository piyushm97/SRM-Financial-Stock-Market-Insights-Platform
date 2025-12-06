// utils/calcPnL.js
export function calcPnL({ buyPrice, currentPrice, quantity }) {
  if (quantity <= 0) return 0;
  return (currentPrice - buyPrice) * quantity;
}

export function calcPnLPercent({ buyPrice, currentPrice }) {
  if (buyPrice === 0) return 0;
  return ((currentPrice - buyPrice) / buyPrice) * 100;
}
