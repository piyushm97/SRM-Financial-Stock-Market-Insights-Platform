// utils/pivotPoints.js
export function pivotPoints(high, low, close) {
  const pivot = (high + low + close) / 3;
  return {
    pivot: Number(pivot.toFixed(2)),
    r1: Number((2 * pivot - low).toFixed(2)),
    r2: Number((pivot + (high - low)).toFixed(2)),
    r3: Number((high + 2 * (pivot - low)).toFixed(2)),
    s1: Number((2 * pivot - high).toFixed(2)),
    s2: Number((pivot - (high - low)).toFixed(2)),
    s3: Number((low - 2 * (high - pivot)).toFixed(2))
  };
}
