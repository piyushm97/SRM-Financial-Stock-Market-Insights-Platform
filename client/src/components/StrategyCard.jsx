// client/src/components/StrategyCard.jsx
export default function StrategyCard({ strategy, onToggle }) {
  const winRateColor = strategy.performance.winRate >= 60 ? "#22c55e" : strategy.performance.winRate >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ padding: 14, background: "#111827", borderRadius: 8, border: "1px solid #1f2937" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600 }}>{strategy.name}</h4>
        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <input type="checkbox" checked={strategy.active} onChange={() => onToggle?.(strategy._id)} />
          <span style={{ fontSize: 11, color: strategy.active ? "#22c55e" : "#9ca3af" }}>
            {strategy.active ? "Active" : "Paused"}
          </span>
        </label>
      </div>
      <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>{strategy.description}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontSize: 11 }}>
        <div>
          <div style={{ color: "#6b7280" }}>Trades</div>
          <div style={{ fontWeight: 600 }}>{strategy.performance.totalTrades}</div>
        </div>
        <div>
          <div style={{ color: "#6b7280" }}>Win Rate</div>
          <div style={{ fontWeight: 600, color: winRateColor }}>{strategy.performance.winRate.toFixed(1)}%</div>
        </div>
        <div>
          <div style={{ color: "#6b7280" }}>Avg Return</div>
          <div style={{ fontWeight: 600 }}>{strategy.performance.avgReturn.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
}
