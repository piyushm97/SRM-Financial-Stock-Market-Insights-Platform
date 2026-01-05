// client/src/components/PerformanceReport.jsx
export default function PerformanceReport({ report }) {
  const color = report.totalReturn >= 0 ? "#22c55e" : "#ef4444";

  return (
    <div style={{ padding: 16, background: "#111827", borderRadius: 8, border: "1px solid #1f2937" }}>
      <h3 style={{ fontSize: 16, marginBottom: 12 }}>Performance Report</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
        <div>
          <div style={{ color: "#9ca3af", marginBottom: 4 }}>Total Value</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>${report.totalValue}</div>
        </div>
        <div>
          <div style={{ color: "#9ca3af", marginBottom: 4 }}>Net Cash Flow</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>${report.netCashFlow}</div>
        </div>
        <div>
          <div style={{ color: "#9ca3af", marginBottom: 4 }}>Total Return</div>
          <div style={{ fontSize: 18, fontWeight: 600, color }}>${report.totalReturn}</div>
        </div>
        <div>
          <div style={{ color: "#9ca3af", marginBottom: 4 }}>Return %</div>
          <div style={{ fontSize: 18, fontWeight: 600, color }}>
            {report.returnPercent >= 0 ? "+" : ""}{report.returnPercent}%
          </div>
        </div>
      </div>
    </div>
  );
}
