// utils/ichimoku.js
export function ichimoku(highs, lows, closes) {
  const tenkan = 9;
  const kijun = 26;
  const senkouB = 52;
  const displacement = 26;
  
  const calcMidpoint = (arr, period, index) => {
    if (index < period - 1) return null;
    const slice = arr.slice(index - period + 1, index + 1);
    return (Math.max(...slice) + Math.min(...slice)) / 2;
  };
  
  const result = [];
  for (let i = 0; i < closes.length; i++) {
    const tenkanSen = calcMidpoint(highs.map((h, idx) => Math.max(h, lows[idx])), tenkan, i);
    const kijunSen = calcMidpoint(highs.map((h, idx) => Math.max(h, lows[idx])), kijun, i);
    
    result.push({
      tenkanSen: tenkanSen ? Number(tenkanSen.toFixed(2)) : null,
      kijunSen: kijunSen ? Number(kijunSen.toFixed(2)) : null
    });
  }
  
  return result;
}
