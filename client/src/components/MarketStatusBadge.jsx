// client/src/components/MarketStatusBadge.jsx
import { isMarketOpen } from "../../utils/isMarketOpen.js";

export default function MarketStatusBadge() {
  const open = isMarketOpen();
  const color = open ? "#22c55e" : "#ef4444";
  const text = open ? "Market Open" : "Market Closed";

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, border: `1px solid ${color}`, fontSize: 11 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
      <span style={{ color }}>{text}</span>
    </div>
  );
}
