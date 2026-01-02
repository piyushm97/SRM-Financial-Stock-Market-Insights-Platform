// client/src/components/PriceAlert.jsx
export default function PriceAlert({ symbol, target, current }) {
  const reached = current >= target;
  return (
    <div
      style={{
        padding: "8px 12px",
        borderRadius: 6,
        background: reached ? "#14532d" : "#1e293b",
        border: `1px solid ${reached ? "#22c55e" : "#334155"}`,
        fontSize: 12
      }}
    >
      <strong>{symbol}</strong> alert at {target} {reached ? "✓ REACHED" : `(Current: ${current})`}
    </div>
  );
}
