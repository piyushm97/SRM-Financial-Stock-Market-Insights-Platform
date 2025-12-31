// client/src/hooks/useWatchlist.js
import { useEffect, useState } from "react";
import { getWatchlist } from "../services/watchlistApi.js";

export default function useWatchlist(userId) {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getWatchlist(userId)
      .then((data) => setWatchlist(data.symbols || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  return { watchlist, loading, refresh: () => getWatchlist(userId).then(d => setWatchlist(d.symbols)) };
}
