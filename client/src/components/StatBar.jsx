// utils/avgHoldingPeriod.js
export function avgHoldingPeriod(trades) {
  if (!trades.length) return 0;
  const days = trades.map(t => {
    const entry = new Date(t.entryDate);
    const exit = new Date(t.exitDate);
    return (exit - entry) / (1000 * 60 * 60 * 24);
  });
  const total = days.reduce((s, d) => s + d, 0);
  return Number((total / trades.length).toFixed(1));
}
