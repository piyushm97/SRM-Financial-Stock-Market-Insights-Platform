// utils/momentum.js
export function momentum(prices, period = 10) {
  if (prices.length <= period) return [];
  return prices.slice(period).map((p, i) => 
    Number((((p - prices[i]) / prices[i]) * 100).toFixed(2))
  );
}
