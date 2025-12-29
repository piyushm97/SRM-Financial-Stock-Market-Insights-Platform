// client/src/services/portfolioApi.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getPortfolio(userId) {
  const res = await fetch(`${BASE_URL}/api/portfolio/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch portfolio");
  return res.json();
}

export async function updatePortfolio(userId, data) {
  const res = await fetch(`${BASE_URL}/api/portfolio/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update portfolio");
  return res.json();
}
