// utils/stochastic.js
export function stochastic(highs, lows, closes, period = 14) {
  if (closes.length < period) return [];
  
  const kValues = [];
  for (let i = period - 1; i < closes.length; i++) {
    const highSlice = highs.slice(i - period + 1, i + 1);
    const lowSlice = lows.slice(i - period + 1, i + 1);
    const highest = Math.max(...highSlice);
    const lowest = Math.min(...lowSlice);
    const k = lowest === highest ? 50 : ((closes[i] - lowest) / (highest - lowest)) * 100;
    kValues.push(Number(k.toFixed(2)));
  }
  
  return kValues;
}
