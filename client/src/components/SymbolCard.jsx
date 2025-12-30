// client/src/components/SymbolCard.jsx
export default function SymbolCard({ symbol, name, price, change }) {
  const positive = change >= 0;
  const color = positive ? "#22c55e" : "#ef4444";

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 8,
        background: "#020617",
        border: "1px solid #1f2937"
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600 }}>{symbol}</div>
      <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>{name}</div>
      <div style={{ fontSize: 16 }}>${price}</div>
      <div style={{ fontSize: 11, color }}>{positive ? "+" : ""}{change}%</div>
    </div>
  );
}
