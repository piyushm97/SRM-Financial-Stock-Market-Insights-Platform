// utils/groupBySector.js
export function groupBySector(positions) {
  const map = {};
  positions.forEach((p) => {
    const sector = p.sector || "Unknown";
    const value = p.quantity * p.lastPrice;
    map[sector] = (map[sector] || 0) + value;
  });
  return Object.entries(map).map(([sector, value]) => ({
    sector,
    value: Number(value.toFixed(2))
  }));
}
