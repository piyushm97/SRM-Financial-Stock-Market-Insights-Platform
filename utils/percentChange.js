// utils/percentChange.js
export function percentChange(oldValue, newValue) {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}
