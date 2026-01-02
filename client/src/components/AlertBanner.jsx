// client/src/components/AlertBanner.jsx
export default function AlertBanner({ type = "info", message, onClose }) {
  const colors = {
    info: { bg: "#1e3a8a", text: "#bfdbfe" },
    success: { bg: "#14532d", text: "#bbf7d0" },
    warning: { bg: "#78350f", text: "#fef3c7" },
    error: { bg: "#7f1d1d", text: "#fee2e2" }
  };

  const style = colors[type] || colors.info;

  return (
    <div
      style={{
        padding: "10px 14px",
        borderRadius: 6,
        background: style.bg,
        color: style.text,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 13
      }}
    >
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: style.text, cursor: "pointer", fontSize: 16 }}>
          ×
        </button>
      )}
    </div>
  );
}
