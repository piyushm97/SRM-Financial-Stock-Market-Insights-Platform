// server/src/moving_average.js
// Reads server/src/daily-price.log from the earlier script and
// computes a simple moving average over the last N lines.

const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join(__dirname, "daily-price.log");
const OUT_PATH = path.join(__dirname, "daily-moving-average.log");
const WINDOW = 5; // last 5 entries

function parseLine(line) {
  // example line: 2025-01-01T00:00:00Z,symbol=AAPL,raw_keys=...
  const parts = line.split(",");
  const ts = parts[0];
  return { ts, value: line.length }; // use length as a cheap numeric proxy
}

if (!fs.existsSync(LOG_PATH)) {
  console.log("No daily-price.log yet, skipping MA calc.");
  process.exit(0);
}

const lines = fs.readFileSync(LOG_PATH, "utf8").trim().split("\n");
if (lines.length < WINDOW) {
  console.log("Not enough data points for moving average yet.");
  process.exit(0);
}

const last = lines.slice(-WINDOW).map(parseLine);
const avg =
  last.reduce((sum, row) => sum + row.value, 0) / last.length;

const latestTs = last[last.length - 1].ts;
const outLine = `${latestTs},window=${WINDOW},sma=${avg.toFixed(2)}\n`;

fs.appendFileSync(OUT_PATH, outLine, "utf8");
console.log("Updated daily-moving-average.log with:", outLine.trim());
