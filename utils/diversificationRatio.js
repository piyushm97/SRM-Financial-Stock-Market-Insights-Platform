// utils/diversificationRatio.js
export function diversificationRatio(positions) {
  if (positions.length <= 1) return 0;
  
  const totalValue = positions.reduce((s, p) => s + p.value, 0);
  const herfindahl = positions.reduce((s, p) => {
    const weight = p.value / totalValue;
    return s + weight * weight;
  }, 0);
  
  return Number((1 / herfindahl).toFixed(2));
}
