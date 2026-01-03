// client/src/components/QuickStats.jsx
export default function QuickStats({ totalValue, todayPnL, positions }) {
  const pnlColor = todayPnL >= 0 ? "#22c55e" : "#ef4444";

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 140, padding: 12, background: "#111827", borderRadius: 8 }}>
        <div style={{ fontSize: 11, color: "#9ca3af" }}>Total Value</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>${totalValue.toFixed(2)}</div>
      </div>
      <div style={{ flex: 1, minWidth: 140, padding: 12, background: "#111827", borderRadius: 8 }}>
        <div style={{ fontSize: 11, color: "#9ca3af" }}>Today's P&L</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: pnlColor }}>
          {todayPnL >= 0 ? "+" : ""}${todayPnL.toFixed(2)}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 140, padding: 12, background: "#111827", borderRadius: 8 }}>
        <div style={{ fontSize: 11, color: "#9ca3af" }}>Positions</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{positions}</div>
      </div>
    </div>
  );
}
