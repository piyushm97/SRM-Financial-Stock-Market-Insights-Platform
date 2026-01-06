// server/src/routes/strategies.js
import express from "express";
import Strategy from "../models/Strategy.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const strategies = await Strategy.find({ userId: req.params.userId });
    res.json(strategies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const strategy = new Strategy(req.body);
    const saved = await strategy.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updated = await Strategy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
