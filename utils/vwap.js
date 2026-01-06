// utils/vwap.js
export function vwap(highs, lows, closes, volumes) {
  const typicalPrices = closes.map((c, i) => (highs[i] + lows[i] + c) / 3);
  let cumVolume = 0;
  let cumTypicalPriceVolume = 0;
  
  return typicalPrices.map((tp, i) => {
    cumTypicalPriceVolume += tp * volumes[i];
    cumVolume += volumes[i];
    return Number((cumTypicalPriceVolume / cumVolume).toFixed(2));
  });
}
