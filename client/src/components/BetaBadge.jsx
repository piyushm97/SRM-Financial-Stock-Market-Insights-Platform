// client/src/components/BetaBadge.jsx
export default function BetaBadge({ beta }) {
  const color = beta < 1 ? "#22c55e" : beta > 1.5 ? "#ef4444" : "#f59e0b";
  const label = beta < 1 ? "Low Beta" : beta > 1.5 ? "High Beta" : "Moderate Beta";

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, border: `1px solid ${color}`, fontSize: 11 }}>
      <span style={{ fontWeight: 600 }}>β {beta.toFixed(2)}</span>
      <span style={{ color }}>{label}</span>
    </div>
  );
}
