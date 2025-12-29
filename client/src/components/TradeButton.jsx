// client/src/components/TradeButton.jsx
export default function TradeButton({ type, onClick, disabled }) {
  const isBuy = type === "BUY";
  const bg = isBuy ? "#22c55e" : "#ef4444";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 16px",
        borderRadius: 6,
        border: "none",
        background: bg,
        color: "#fff",
        fontWeight: 600,
        fontSize: 13,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1
      }}
    >
      {isBuy ? "Buy" : "Sell"}
    </button>
  );
}
