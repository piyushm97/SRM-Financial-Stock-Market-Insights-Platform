// server/src/routes/stocks.js
import express from "express";
import Stock from "../models/Stock.js";

const router = express.Router();

// GET /api/stocks
router.get("/", async (req, res) => {
  try {
    const stocks = await Stock.find().limit(50).sort({ symbol: 1 });
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stocks" });
  }
});

// POST /api/stocks
router.post("/", async (req, res) => {
  try {
    const stock = new Stock(req.body);
    const saved = await stock.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to create stock" });
  }
});

// GET /api/stocks/:symbol
router.get("/:symbol", async (req, res) => {
  try {
    const doc = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!doc) return res.status(404).json({ error: "Stock not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stock" });
  }
});

export default router;
