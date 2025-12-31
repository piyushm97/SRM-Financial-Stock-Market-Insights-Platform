// server/src/routes/watchlist.js
import express from "express";
import Watchlist from "../models/Watchlist.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    let wl = await Watchlist.findOne({ userId: req.params.userId });
    if (!wl) {
      wl = await Watchlist.create({ userId: req.params.userId, symbols: [] });
    }
    res.json(wl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:userId/add", async (req, res) => {
  try {
    const { symbol } = req.body;
    const wl = await Watchlist.findOneAndUpdate(
      { userId: req.params.userId },
      { $addToSet: { symbols: symbol.toUpperCase() } },
      { new: true, upsert: true }
    );
    res.json(wl);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:userId/remove/:symbol", async (req, res) => {
  try {
    const wl = await Watchlist.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { symbols: req.params.symbol.toUpperCase() } },
      { new: true }
    );
    res.json(wl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
