// utils/keltner.js
import { ema } from "./ema.js";
import { atr } from "./atr.js";

export function keltner(highs, lows, closes, period = 20, multiplier = 2) {
  const middle = ema(closes, period);
  const atrValues = atr(highs, lows, closes, period);
  
  return middle.slice(-atrValues.length).map((m, i) => ({
    upper: Number((m + multiplier * atrValues[i]).toFixed(2)),
    middle: Number(m.toFixed(2)),
    lower: Number((m - multiplier * atrValues[i]).toFixed(2))
  }));
}
