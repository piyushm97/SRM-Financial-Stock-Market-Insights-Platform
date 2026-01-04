// client/src/services/transactionApi.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getTransactions(userId) {
  const res = await fetch(`${BASE_URL}/api/transactions/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

export async function createTransaction(data) {
  const res = await fetch(`${BASE_URL}/api/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to create transaction");
  return res.json();
}
