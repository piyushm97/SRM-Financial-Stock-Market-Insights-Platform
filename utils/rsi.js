// utils/rsi.js
export function rsi(prices, period = 14) {
  if (prices.length < period + 1) return [];
  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }
  
  const result = [];
  for (let i = period - 1; i < changes.length; i++) {
    const slice = changes.slice(i - period + 1, i + 1);
    const gains = slice.filter(c => c > 0).reduce((s, c) => s + c, 0) / period;
    const losses = Math.abs(slice.filter(c => c < 0).reduce((s, c) => s + c, 0)) / period;
    const rs = losses === 0 ? 100 : gains / losses;
    const rsiVal = 100 - (100 / (1 + rs));
    result.push(Number(rsiVal.toFixed(2)));
  }
  return result;
}
