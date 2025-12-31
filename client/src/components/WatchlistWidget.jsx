// client/src/components/WatchlistWidget.jsx
import { useState } from "react";
import { addToWatchlist, removeFromWatchlist } from "../services/watchlistApi.js";

export default function WatchlistWidget({ userId, symbols, onUpdate }) {
  const [input, setInput] = useState("");

  const handleAdd = async () => {
    if (!input.trim()) return;
    try {
      await addToWatchlist(userId, input.toUpperCase());
      setInput("");
      onUpdate?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (symbol) => {
    try {
      await removeFromWatchlist(userId, symbol);
      onUpdate?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 12, background: "#111827", borderRadius: 8 }}>
      <h3 style={{ fontSize: 14, marginBottom: 8 }}>Watchlist</h3>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add symbol"
          style={{ flex: 1, padding: "4px 8px", borderRadius: 4, border: "1px solid #4b5563", background: "#020617", color: "#e5e7eb" }}
        />
        <button onClick={handleAdd} style={{ padding: "4px 12px", borderRadius: 4, background: "#22c55e", color: "#fff", border: "none" }}>
          +
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0, fontSize: 12 }}>
        {symbols.map((s) => (
          <li key={s} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span>{s}</span>
            <button onClick={() => handleRemove(s)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
