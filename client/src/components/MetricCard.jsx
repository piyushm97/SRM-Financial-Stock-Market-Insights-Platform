// client/src/components/MetricCard.jsx
export default function MetricCard({ label, value, change }) {
  const isPositive = change >= 0;
  const sign = isPositive ? "+" : "";
  const color = isPositive ? "#22c55e" : "#ef4444";

  return (
    <div
      style={{
        padding: "12px 16px",
        borderRadius: 8,
        background: "#020617",
        border: "1px solid #1f2937",
      }}
    >
      <div style={{ fontSize: 12, color: "#9ca3af" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600 }}>{value}</div>
      <div style={{ fontSize: 12, color }}>{sign}{change}%</div>
    </div>
  );
}
