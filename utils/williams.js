// utils/williams.js
export function williamsR(highs, lows, closes, period = 14) {
  if (closes.length < period) return [];
  
  const wrValues = [];
  for (let i = period - 1; i < closes.length; i++) {
    const highSlice = highs.slice(i - period + 1, i + 1);
    const lowSlice = lows.slice(i - period + 1, i + 1);
    const highest = Math.max(...highSlice);
    const lowest = Math.min(...lowSlice);
    const wr = highest === lowest ? -50 : ((highest - closes[i]) / (highest - lowest)) * -100;
    wrValues.push(Number(wr.toFixed(2)));
  }
  
  return wrValues;
}
