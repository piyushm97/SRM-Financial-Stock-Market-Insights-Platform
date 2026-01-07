// client/src/services/strategyApi.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getStrategies(userId) {
  const res = await fetch(`${BASE_URL}/api/strategies/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch strategies");
  return res.json();
}

export async function createStrategy(data) {
  const res = await fetch(`${BASE_URL}/api/strategies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to create strategy");
  return res.json();
}

export async function updateStrategy(id, data) {
  const res = await fetch(`${BASE_URL}/api/strategies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update strategy");
  return res.json();
}

