// scripts/print-latest.js
const fs = require("fs");
const path = require("path");

const snapPath = path.join(__dirname, "..", "server", "src", "strategy_snapshot.json");

if (!fs.existsSync(snapPath)) {
  console.log("No strategy_snapshot.json yet.");
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(snapPath, "utf8"));
console.log("=== SRM Strategy Snapshot ===");
console.log("Generated:", data.generatedAt);
for (const [k, v] of Object.entries(data)) {
  if (k === "generatedAt") continue;
  console.log(`${k}: ${v}`);
}
