// server/src/news_sentiment_dummy.js
// Toy sentiment score using keyword counts in daily-news.log.

const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join(__dirname, "daily-news.log");
const OUT_PATH = path.join(__dirname, "daily-news-sentiment.log");

if (!fs.existsSync(LOG_PATH)) {
  console.log("No daily-news.log yet.");
  process.exit(0);
}

const lines = fs.readFileSync(LOG_PATH, "utf8").trim().split("\n");
const last = lines[lines.length - 1];

const positiveWords = ["gain", "up", "beat", "growth", "record"];
const negativeWords = ["loss", "down", "miss", "fall", "drops"];

const headlinePart = last.split("headline=")[1] || "";
const h = headlinePart.toLowerCase();

let score = 0;
for (const w of positiveWords) if (h.includes(w)) score += 1;
for (const w of negativeWords) if (h.includes(w)) score -= 1;

const ts = last.split(",")[0];
const out = `${ts},score=${score}\n`;

fs.appendFileSync(OUT_PATH, out, "utf8");
console.log("Logged sentiment score:", out.trim());
