// client/src/components/Tag.jsx
export default function Tag({ children, color = "#22c55e" }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        border: `1px solid ${color}`,
        color,
        fontSize: 11,
      }}
    >
      {children}
    </span>
  );
}
