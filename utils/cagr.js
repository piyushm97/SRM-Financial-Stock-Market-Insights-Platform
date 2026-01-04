// utils/cagr.js
export function cagr(startValue, endValue, years) {
  if (startValue <= 0 || years <= 0) return 0;
  return Number(((Math.pow(endValue / startValue, 1 / years) - 1) * 100).toFixed(2));
}
