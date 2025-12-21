// client/src/components/PriceBadge.jsx
import { percentChange } from "../../utils/percentChange.js";

export default function PriceBadge({ symbol, lastPrice, prevClose }) {
  const change = percentChange(prevClose, lastPrice);
  const positive = change >= 0;
  const color = positive ? "#22c55e" : "#ef4444";
  const sign = positive ? "+" : "";

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
      <span style={{ fontWeight: 600 }}>{symbol}</span>
      <span>{lastPrice.toFixed(2)}</span>
      <span style={{ color, fontSize: 12 }}>
        {sign}
        {change.toFixed(2)}%
      </span>
    </div>
  );
}
