// server/src/risk_flag.js
// Combines volatility and sentiment into a simple qualitative risk flag.

const fs = require("fs");
const path = require("path");

const volPath = path.join(__dirname, "daily-volatility.log");
const sentPath = path.join(__dirname, "daily-news-sentiment.log");
const outPath = path.join(__dirname, "daily-risk-flag.log");

function lastLine(p) {
  if (!fs.existsSync(p)) return null;
  const lines = fs.readFileSync(p, "utf8").trim().split("\n");
  return lines[lines.length - 1];
}

const volLine = lastLine(volPath);
const sentLine = lastLine(sentPath);

if (!volLine || !sentLine) {
  console.log("Missing volatility or sentiment data.");
  process.exit(0);
}

const volVal = parseFloat(
  (volLine.split("vol=")[1] || "0").split(",")[0]
);
const scoreVal = parseFloat(
  (sentLine.split("score=")[1] || "0").split(",")[0]
);

let flag = "NEUTRAL";
if (volVal > 5 && scoreVal < 0) flag = "HIGH_RISK";
else if (volVal < 2 && scoreVal > 0) flag = "LOW_RISK";

const ts = new Date().toISOString();
const out = `${ts},vol=${volVal.toFixed(4)},score=${scoreVal},flag=${flag}\n`;

fs.appendFileSync(outPath, out, "utf8");
console.log("Appended risk flag:", out.trim());
