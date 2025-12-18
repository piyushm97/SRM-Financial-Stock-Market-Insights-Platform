// scripts/read-settings-yaml.js
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const filePath = path.join(__dirname, "..", "config", "settings.yaml");
if (!fs.existsSync(filePath)) {
  console.log("settings.yaml missing.");
  process.exit(0);
}

const obj = yaml.load(fs.readFileSync(filePath, "utf8"));
console.log("SRM env:", obj.env, "short MA:", obj.analytics.ma_short);
