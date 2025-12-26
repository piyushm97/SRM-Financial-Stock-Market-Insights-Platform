// client/src/components/SectorBadge.jsx
const colors = {
  Technology: "#22c55e",
  Finance: "#38bdf8",
  Energy: "#f97316"
};

export default function SectorBadge({ sector }) {
  const color = colors[sector] || "#e5e7eb";
  const text = colors[sector] ? "#020617" : "#111827";

  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: 999,
        background: color,
        color: text,
        fontSize: 11
      }}
    >
      {sector || "Unknown"}
    </span>
  );
}
