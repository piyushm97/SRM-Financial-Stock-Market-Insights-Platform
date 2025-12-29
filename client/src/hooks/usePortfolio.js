// client/src/hooks/usePortfolio.js
import { useEffect, useState } from "react";
import { getPortfolio } from "../services/portfolioApi.js";

export default function usePortfolio(userId) {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getPortfolio(userId)
      .then(setPortfolio)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  return { portfolio, loading, error, refresh: () => getPortfolio(userId).then(setPortfolio) };
}
