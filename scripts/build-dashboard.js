// scripts/build-dashboard.js
// Aggregates small metrics into one JSON file for the React client.

const fs = require("fs");
const path = require("path");

function safeReadLines(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, "utf8").trim().split("\n");
}

const root = path.join(__dirname, "..");

const maLines = safeReadLines(path.join(root, "server/src/daily-moving-average.log"));
const volLines = safeReadLines(path.join(root, "server/src/daily-volatility.log"));
const sentLines = safeReadLines(path.join(root, "server/src/daily-news-sentiment.log"));

const latest = (lines) => (lines.length ? lines[lines.length - 1] : null);

const dashboard = {
  generatedAt: new Date().toISOString(),
  movingAverage: latest(maLines),
  volatility: latest(volLines),
  newsSentiment: latest(sentLines),
};

const outPath = path.join(root, "client/src/generated/daily-dashboard.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(dashboard, null, 2) + "\n");

console.log("Updated daily-dashboard.json");
