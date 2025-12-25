// utils/sortByPnL.js
export function sortByPnL(positions) {
  return [...positions].sort(
    (a, b) => b.unrealizedPnL - a.unrealizedPnL
  );
}
