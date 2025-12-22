// utils/portfolioAllocation.js
export function portfolioAllocation(positions) {
  const total = positions.reduce(
    (sum, p) => sum + p.quantity * p.price,
    0
  );
  if (!total) return [];

  return positions.map((p) => {
    const value = p.quantity * p.price;
    return {
      symbol: p.symbol,
      value,
      weight: Number(((value / total) * 100).toFixed(2))
    };
  });
}
