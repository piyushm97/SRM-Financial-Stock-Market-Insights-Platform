// client/src/components/SeasonalityChart.jsx
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function SeasonalityChart({ data }) {
  return (
    <div style={{ padding: 16, background: "#111827", borderRadius: 8 }}>
      <h4 style={{ fontSize: 13, marginBottom: 12 }}>Monthly Seasonality</h4>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 100 }}>
        {months.map((m, i) => {
          const value = data[i] || 0;
          const color = value >= 0 ? "#22c55e" : "#ef4444";
          const height = Math.abs(value) * 5;
          
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", height: Math.max(2, height), background: color, borderRadius: 2 }} />
              <div style={{ fontSize: 9, color: "#9ca3af" }}>{m}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
