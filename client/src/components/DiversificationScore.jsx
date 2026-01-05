// client/src/components/DiversificationScore.jsx
export default function DiversificationScore({ score, maxScore }) {
  const percent = (score / maxScore) * 100;
  const color = percent > 70 ? "#22c55e" : percent > 40 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ padding: 12, background: "#111827", borderRadius: 8, border: "1px solid #1f2937" }}>
      <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Diversification</div>
      <div style={{ fontSize: 18, fontWeight: 700, color, marginBottom: 8 }}>
        {score.toFixed(1)} / {maxScore}
      </div>
      <div style={{ width: "100%", height: 6, background: "#1f2937", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${percent}%`, height: "100%", background: color }} />
      </div>
    </div>
  );
}
