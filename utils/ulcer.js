// utils/ulcer.js
export function ulcerIndex(prices) {
  if (prices.length < 2) return 0;
  
  let sumSquares = 0;
  for (let i = 0; i < prices.length; i++) {
    const peak = Math.max(...prices.slice(0, i + 1));
    const drawdown = ((peak - prices[i]) / peak) * 100;
    sumSquares += drawdown * drawdown;
  }
  
  return Number(Math.sqrt(sumSquares / prices.length).toFixed(4));
}
