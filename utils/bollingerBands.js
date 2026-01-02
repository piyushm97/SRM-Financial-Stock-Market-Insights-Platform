// utils/bollingerBands.js
import { sma } from "./movingAverage.js";

export function bollingerBands(prices, period = 20, multiplier = 2) {
  const middle = sma(prices, period);
  const bands = [];
  
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    const mean = middle[i - period + 1];
    const variance = slice.reduce((s, p) => s + Math.pow(p - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    
    bands.push({
      upper: Number((mean + multiplier * stdDev).toFixed(2)),
      middle: Number(mean.toFixed(2)),
      lower: Number((mean - multiplier * stdDev).toFixed(2))
    });
  }
  
  return bands;
}
