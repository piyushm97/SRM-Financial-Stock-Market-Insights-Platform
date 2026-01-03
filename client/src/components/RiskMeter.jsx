// client/src/components/RiskMeter.jsx
export default function RiskMeter({ score }) {
  const color = score < 3 ? "#22c55e" : score < 7 ? "#f59e0b" : "#ef4444";
  const label = score < 3 ? "Low Risk" : score < 7 ? "Medium Risk" : "High Risk";

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 32, fontWeight: 700, color }}>{score.toFixed(1)}</div>
      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{label}</div>
      <div style={{ width: "100%", height: 6, background: "#1f2937", borderRadius: 999, marginTop: 8, overflow: "hidden" }}>
        <div style={{ width: `${(score / 10) * 100}%`, height: "100%", background: color }} />
      </div>
    </div>
  );
}
