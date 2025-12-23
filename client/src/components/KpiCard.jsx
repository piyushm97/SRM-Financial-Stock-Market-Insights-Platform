// client/src/components/KpiCard.jsx
export default function KpiCard({ label, value, helper }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        borderRadius: 10,
        background: "#020617",
        border: "1px solid #1f2937",
        minWidth: 160
      }}
    >
      <div style={{ fontSize: 11, color: "#9ca3af" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
      {helper && (
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
          {helper}
        </div>
      )}
    </div>
  );
}
