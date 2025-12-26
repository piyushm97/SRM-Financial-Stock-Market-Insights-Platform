// client/src/hooks/useQuote.js
import { useEffect, useState } from "react";
import { getQuote } from "../services/apiClient.js";

export default function useQuote(symbol) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setError("");
    getQuote(symbol)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [symbol]);

  return { data, loading, error };
}
