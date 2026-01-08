// utils/adx.js
export function adx(highs, lows, closes, period = 14) {
  if (closes.length < period + 1) return [];
  
  const tr = [];
  const plusDM = [];
  const minusDM = [];
  
  for (let i = 1; i < closes.length; i++) {
    const high = highs[i] - highs[i - 1];
    const low = lows[i - 1] - lows[i];
    
    plusDM.push(high > low && high > 0 ? high : 0);
    minusDM.push(low > high && low > 0 ? low : 0);
    
    const trVal = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    );
    tr.push(trVal);
  }
  
  const adxValues = [];
  for (let i = period - 1; i < tr.length; i++) {
    const avgTR = tr.slice(i - period + 1, i + 1).reduce((s, v) => s + v, 0) / period;
    const avgPlusDM = plusDM.slice(i - period + 1, i + 1).reduce((s, v) => s + v, 0) / period;
    const avgMinusDM = minusDM.slice(i - period + 1, i + 1).reduce((s, v) => s + v, 0) / period;
    
    const plusDI = avgTR === 0 ? 0 : (avgPlusDM / avgTR) * 100;
    const minusDI = avgTR === 0 ? 0 : (avgMinusDM / avgTR) * 100;
    const dx = plusDI + minusDI === 0 ? 0 : Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
    
    adxValues.push(Number(dx.toFixed(2)));
  }
  
  return adxValues;
}
