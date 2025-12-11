// utils/arrayHelpers.js
export function unique(arr) {
  return Array.from(new Set(arr));
}

export function sum(arr) {
  return arr.reduce((total, n) => total + Number(n || 0), 0);
}

export function average(arr) {
  if (!arr.length) return 0;
  return sum(arr) / arr.length;
}
