// utils/totalValue.js
export function totalValue(positions, priceMap) {
  return positions.reduce((sum, p) => {
    const price = priceMap[p.symbol] ?? 0;
    return sum + p.quantity * price;
  }, 0);
}
