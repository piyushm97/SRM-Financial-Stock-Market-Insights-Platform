// client/src/components/OrderList.jsx
export default function OrderList({ orders }) {
  if (!orders.length) return <p>No orders yet.</p>;
  return (
    <ul style={{ fontSize: 13, paddingLeft: 16 }}>
      {orders.map((o) => (
        <li key={o._id || `${o.symbol}-${o.createdAt}`}>
          {o.side} {o.quantity} {o.symbol} – {o.status}
        </li>
      ))}
    </ul>
  );
}
