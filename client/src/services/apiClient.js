// client/src/services/apiClient.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export function getQuote(symbol) {
  return request(`/api/quote/${encodeURIComponent(symbol)}`);
}
