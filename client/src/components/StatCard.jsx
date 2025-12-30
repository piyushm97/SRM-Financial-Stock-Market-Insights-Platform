// client/src/components/StatCard.jsx
export default function StatCard({ icon, label, value, subtext }) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 8,
        background: "#111827",
        border: "1px solid #1f2937"
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 11, color: "#9ca3af" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{value}</div>
      {subtext && (
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{subtext}</div>
      )}
    </div>
  );
}
