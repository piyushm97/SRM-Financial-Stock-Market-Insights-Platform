// client/src/components/RealtimePrice.jsx
import useQuote from "../hooks/useQuote.js";

export default function RealtimePrice({ symbol }) {
  const { data, loading, error } = useQuote(symbol);

  if (!symbol) return null;
  if (loading) return <span>Loading {symbol}…</span>;
  if (error) return <span>Error: {error}</span>;
  if (!data?.price) return <span>No data</span>;

  return (
    <span>
      {symbol}: {data.price.toFixed(2)} {data.currency}
    </span>
  );
}
