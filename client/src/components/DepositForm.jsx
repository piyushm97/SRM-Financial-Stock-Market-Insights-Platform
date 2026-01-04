// client/src/components/DepositForm.jsx
import { useState } from "react";

export default function DepositForm({ onSubmit }) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    onSubmit?.({ type: "DEPOSIT", amount: Number(amount) });
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: "1px solid #4b5563", background: "#020617", color: "#e5e7eb" }}
      />
      <button type="submit" style={{ padding: "6px 16px", borderRadius: 6, background: "#22c55e", color: "#fff", border: "none", fontWeight: 600 }}>
        Deposit
      </button>
    </form>
  );
}
