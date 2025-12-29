// client/src/components/CashBalance.jsx
import { formatCurrency } from "../../utils/numberFormat.js";

export default function CashBalance({ cash, currency = "USD" }) {
  return (
    <div style={{ fontSize: 13, color: "#9ca3af" }}>
      Cash: <strong style={{ color: "#e5e7eb" }}>{formatCurrency(cash, currency)}</strong>
    </div>
  );
}
