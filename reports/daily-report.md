// scripts/build-daily-report.js
const fs = require("fs");
const path = require("path");

function lastLine(p) {
  if (!fs.existsSync(p)) return null;
  const lines = fs.readFileSync(p, "utf8").trim().split("\n");
  return lines[lines.length - 1] || null;
}

const root = path.join(__dirname, "..");
const now = new Date().toISOString();

const sections = {
  "Price": lastLine(path.join(root, "server/src/daily-price.log")),
  "Return": lastLine(path.join(root, "server/src/daily-returns.log")),
  "Equity": lastLine(path.join(root, "server/src/equity-curve.log")),
  "Volatility": lastLine(path.join(root, "server/src/daily-volatility.log")),
  "News sentiment": lastLine(path.join(root, "server/src/daily-news-sentiment.log")),
  "Risk flag": lastLine(path.join(root, "server/src/daily-risk-flag.log")),
};

let md = `# SRM Daily Report\n\nGenerated at: ${now}\n\n`;
for (const [title, line] of Object.entries(sections)) {
  md += `## ${title}\n\n`;
  md += line ? `\`${line}\`\n\n` : "_no data_\n\n";
}

const outPath = path.join(root, "reports/daily-report.md");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, md, "utf8");

console.log("Updated reports/daily-report.md");
