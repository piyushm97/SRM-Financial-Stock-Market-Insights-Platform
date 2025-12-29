// server/src/routes/portfolio.js
import express from "express";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.params.userId });
    if (!portfolio) {
      portfolio = await Portfolio.create({ userId: req.params.userId });
    }
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:userId", async (req, res) => {
  try {
    const updated = await Portfolio.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
