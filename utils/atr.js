// utils/atr.js
export function atr(highs, lows, closes, period = 14) {
  if (highs.length < period + 1) return [];
  
  const trueRanges = [];
  for (let i = 1; i < highs.length; i++) {
    const tr = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    );
    trueRanges.push(tr);
  }
  
  const atrValues = [];
  for (let i = period - 1; i < trueRanges.length; i++) {
    const slice = trueRanges.slice(i - period + 1, i + 1);
    const avg = slice.reduce((s, v) => s + v, 0) / period;
    atrValues.push(Number(avg.toFixed(4)));
  }
  
  return atrValues;
}
