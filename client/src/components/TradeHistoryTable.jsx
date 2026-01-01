// client/src/components/TradeHistoryTable.jsx
export default function TradeHistoryTable({ trades }) {
  if (!trades.length) return <p>No trades yet.</p>;

  return (
    <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ textAlign: "left", borderBottom: "1px solid #1f2937" }}>
          <th>Date</th>
          <th>Symbol</th>
          <th>Side</th>
          <th>Qty</th>
          <th>Price</th>
          <th>PnL</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((t, i) => {
          const pnlColor = t.pnl >= 0 ? "#22c55e" : "#ef4444";
          return (
            <tr key={i} style={{ borderBottom: "1px solid #111827" }}>
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>{t.symbol}</td>
              <td>{t.side}</td>
              <td>{t.quantity}</td>
              <td>{t.price.toFixed(2)}</td>
              <td style={{ color: pnlColor }}>{t.pnl.toFixed(2)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
