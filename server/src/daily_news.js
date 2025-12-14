// server/src/daily_news.js
// Fetches one finance headline and appends it to a log.

const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch"); // add to package.json dependencies

const apiKey = process.env.NEWS_API_KEY;
const symbol = process.env.SRM_NEWS_SYMBOL || "AAPL";

if (!apiKey) {
  console.error("Missing NEWS_API_KEY.");
  process.exit(1);
}

const url = `https://newsapi.org/v2/everything?q=${symbol}&sortBy=publishedAt&pageSize=1&apiKey=${apiKey}`;

async function run() {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();
  const article = (data.articles || [])[0];
  const now = new Date().toISOString();
  const headline = article ? article.title : "no-article";
  const line = `${now},symbol=${symbol},headline="${headline.replace(/"/g, "'")}"\n`;

  const logPath = path.join(__dirname, "daily-news.log");
  fs.appendFileSync(logPath, line, "utf8");
  console.log("Logged daily news:", line.trim());
}

run().catch((e) => {
  console.error("Failed to fetch news:", e);
  process.exit(1);
});
