// utils/fibonacci.js
export function fibonacciLevels(high, low) {
  const diff = high - low;
  return {
    level_0: Number(low.toFixed(2)),
    level_236: Number((low + diff * 0.236).toFixed(2)),
    level_382: Number((low + diff * 0.382).toFixed(2)),
    level_500: Number((low + diff * 0.500).toFixed(2)),
    level_618: Number((low + diff * 0.618).toFixed(2)),
    level_786: Number((low + diff * 0.786).toFixed(2)),
    level_100: Number(high.toFixed(2))
  };
}
