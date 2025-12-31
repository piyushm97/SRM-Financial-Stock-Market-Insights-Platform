// utils/macd.js
import { ema } from "./ema.js";

export function macd(prices, fast = 12, slow = 26, signal = 9) {
  const emaFast = ema(prices, fast);
  const emaSlow = ema(prices, slow);
  const macdLine = emaFast.map((v, i) => v - emaSlow[i]);
  const signalLine = ema(macdLine, signal);
  const histogram = macdLine.map((v, i) => v - signalLine[i]);
  
  return {
    macd: macdLine.map(v => Number(v.toFixed(4))),
    signal: signalLine.map(v => Number(v.toFixed(4))),
    histogram: histogram.map(v => Number(v.toFixed(4)))
  };
}
