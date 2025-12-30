// utils/sortBySector.js
export function sortBySector(positions) {
  return [...positions].sort((a, b) => {
    const sA = a.sector || "Unknown";
    const sB = b.sector || "Unknown";
    return sA.localeCompare(sB);
  });
}
