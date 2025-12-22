// server/src/services/fetchPrice.js
import fetch from "node-fetch";

const BASE_URL =
  "https://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&symbols=";

export async function fetchPrice(symbol) {
  const url = `${BASE_URL}${encodeURIComponent(symbol)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch price");
  const json = await res.json();
  const quote = json.quoteResponse?.result?.[0];
  return {
    symbol,
    price: quote?.regularMarketPrice ?? null,
    currency: quote?.currency ?? "USD"
  };
}
