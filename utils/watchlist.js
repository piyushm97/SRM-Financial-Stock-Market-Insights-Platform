// utils/watchlist.js
export function addToWatchlist(list, symbol) {
  const s = symbol.toUpperCase();
  if (list.includes(s)) return list;
  return [...list, s];
}

export function removeFromWatchlist(list, symbol) {
  const s = symbol.toUpperCase();
  return list.filter((item) => item !== s);
}
