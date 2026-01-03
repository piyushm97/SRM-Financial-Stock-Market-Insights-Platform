// server/src/services/fetchNews.js
import fetch from "node-fetch";

export async function fetchNews(symbol, apiKey) {
  const url = `https://newsapi.org/v2/everything?q=${symbol}&apiKey=${apiKey}&pageSize=5`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("News fetch failed");
  const json = await res.json();
  return json.articles.map(a => ({
    title: a.title,
    source: a.source.name,
    url: a.url,
    publishedAt: a.publishedAt
  }));
}
