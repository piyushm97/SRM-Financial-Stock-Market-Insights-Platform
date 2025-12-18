const express = require("express");
const fs = require("fs");
const path = require("path");
const marked = require("marked");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve client
app.use(express.static(path.join(__dirname, "client")));

// Load summary JSON if present else use sample
function loadSummary() {
  const p = path.join(__dirname, "data", "daily-summary.json");
  if (fs.existsSync(p)) {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  }
  return {
    date: new Date().toISOString().slice(0, 10),
    market_overview: "Mixed session with light volume",
    top_movers: [
      { ticker: "AAPL", change_pct: 1.2 },
      { ticker: "MSFT", change_pct: -0.8 },
      { ticker: "TSLA", change_pct: 2.4 }
    ],
    signals: [
      { name: "Mean reversion", status: "Active" },
      { name: "Momentum", status: "Neutral" }
    ]
  };
}

// Load daily report markdown if present else use sample
function loadReport() {
  const p = path.join(__dirname, "reports", "daily-report.md");
  if (fs.existsSync(p)) {
    return fs.readFileSync(p, "utf8");
  }
  return "# Daily Report\n\nOverview\n\nMarket breadth stable\n\nFocus list AAPL MSFT TSLA";
}

// Settings endpoint from config if present
function loadSettings() {
  const p = path.join(__dirname, "config", "settings.yaml");
  if (fs.existsSync(p)) {
    return fs.readFileSync(p, "utf8");
  }
  return "refresh_interval_seconds: 60\nshow_predictions: true";
}

app.get("/api/summary", (req, res) => {
  res.json(loadSummary());
});

app.get("/api/report", (req, res) => {
  const md = loadReport();
  res.json({ markdown: md, html: marked.parse(md) });
});

app.get("/api/settings", (req, res) => {
  res.type("text/plain").send(loadSettings());
});

app.listen(PORT, () => {
  console.log(`SRM Financial running on port ${PORT}`);
});
