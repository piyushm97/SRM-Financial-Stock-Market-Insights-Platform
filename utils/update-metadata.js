// utils/update-metadata.js
const fs = require("fs");
const path = require("path");

const metaPath = path.join(__dirname, "..", "data", "metadata.json");

let meta = {};
if (fs.existsSync(metaPath)) {
  meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
}

meta.lastDataRefresh = new Date().toISOString();

fs.mkdirSync(path.dirname(metaPath), { recursive: true });
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");

console.log("metadata.json lastDataRefresh updated.");
