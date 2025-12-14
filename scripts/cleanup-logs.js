// scripts/cleanup-logs.js
// Deletes *.log* files in server/src and scripts older than 14 days.

const fs = require("fs");
const path = require("path");

const TARGET_DIRS = [
  path.join(__dirname),
  path.join(__dirname, "..", "server", "src"),
];

const maxAgeDays = 14;
const cutoffMs = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;

for (const dir of TARGET_DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".log")) continue;
    const full = path.join(dir, file);
    const stats = fs.statSync(full);
    if (stats.mtimeMs < cutoffMs) {
      fs.unlinkSync(full);
      console.log("Deleted old log:", full);
    }
  }
}
