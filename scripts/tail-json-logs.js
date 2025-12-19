// scripts/tail-json-logs.js
const fs = require("fs");
const path = require("path");

const logPath = path.join(__dirname, "..", "server", "src", "job-logs.ndjson");
const N = 5;

if (!fs.existsSync(logPath)) {
  console.log("No job-logs.ndjson.");
  process.exit(0);
}

const lines = fs.readFileSync(logPath, "utf8").trim().split("\n");
const tail = lines.slice(-N).map((l) => JSON.parse(l));

console.log("==== Last", tail.length, "JSON log entries ====");
for (const e of tail) {
  console.log(`[${e.time}] ${e.level}: ${e.message}`);
}
