// client/src/components/AlertForm.jsx
import { useState } from "react";

export default function AlertForm({ onSubmit }) {
  const [symbol, setSymbol] = useState("");
  const [condition, setCondition] = useState("ABOVE");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ symbol: symbol.toUpperCase(), condition, targetPrice: Number(price) });
    setSymbol("");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, fontSize: 12 }}>
      <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Symbol" style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #4b5563", background: "#020617", color: "#e5e7eb" }} />
      <select value={condition} onChange={(e) => setCondition(e.target.value)} style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #4b5563", background: "#020617", color: "#e5e7eb" }}>
        <option value="ABOVE">Above</option>
        <option value="BELOW">Below</option>
      </select>
      <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" style={{ width: 80, padding: "4px 8px", borderRadius: 4, border: "1px solid #4b5563", background: "#020617", color: "#e5e7eb" }} />
      <button type="submit" style={{ padding: "4px 12px", borderRadius: 4, background: "#22c55e", color: "#fff", border: "none" }}>Set</button>
    </form>
  );
}
