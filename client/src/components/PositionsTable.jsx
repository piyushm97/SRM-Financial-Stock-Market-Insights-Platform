// client/src/components/PositionsTable.jsx
export default function PositionsTable({ positions }) {
  return (
    <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ textAlign: "left", borderBottom: "1px solid #1f2937" }}>
          <th>Symbol</th>
          <th>Qty</th>
          <th>Avg Price</th>
          <th>Last</th>
        </tr>
      </thead>
      <tbody>
        {positions.map((p) => (
          <tr key={p.symbol}>
            <td>{p.symbol}</td>
            <td>{p.quantity}</td>
            <td>{p.avgPrice.toFixed(2)}</td>
            <td>{p.lastPrice.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
