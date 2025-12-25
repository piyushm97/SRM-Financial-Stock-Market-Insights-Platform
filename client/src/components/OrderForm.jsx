// client/src/components/OrderForm.jsx
import { useState } from "react";

export default function OrderForm({ onSubmit }) {
  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState("BUY");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({
      symbol: symbol.toUpperCase(),
      side,
      quantity: Number(quantity)
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Symbol"
      />
      <select value={side} onChange={(e) => setSide(e.target.value)}>
        <option value="BUY">Buy</option>
        <option value="SELL">Sell</option>
      </select>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button type="submit">Place</button>
    </form>
  );
}
