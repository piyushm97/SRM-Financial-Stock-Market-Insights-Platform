// client/src/services/watchlistApi.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getWatchlist(userId) {
  const res = await fetch(`${BASE_URL}/api/watchlist/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch watchlist");
  return res.json();
}

export async function addToWatchlist(userId, symbol) {
  const res = await fetch(`${BASE_URL}/api/watchlist/${userId}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol })
  });
  if (!res.ok) throw new Error("Failed to add symbol");
  return res.json();
}

export async function removeFromWatchlist(userId, symbol) {
  const res = await fetch(`${BASE_URL}/api/watchlist/${userId}/remove/${symbol}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to remove symbol");
  return res.json();
}
