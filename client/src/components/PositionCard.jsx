// client/src/components/PositionCard.jsx
export default function PositionCard({ symbol, quantity, avgCost, currentPrice }) {
  const value = quantity * currentPrice;
  const cost = quantity * avgCost;
  const pnl = value - cost;
  const pnlPercent = ((pnl / cost) * 100).toFixed(2);
  const color = pnl >= 0 ? "#22c55e" : "#ef4444";

  return (
    <div style={{ padding: 14, background: "#111827", borderRadius: 8, border: "1px solid #1f2937" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{symbol}</div>
        <div style={{ fontSize: 14 }}>{quantity} shares</div>
      </div>
      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>
        Avg: ${avgCost.toFixed(2)} | Current: ${currentPrice.toFixed(2)}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color }}>
        {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)} ({pnl >= 0 ? "+" : ""}{pnlPercent}%)
      </div>
    </div>
  );
}
