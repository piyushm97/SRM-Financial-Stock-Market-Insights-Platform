// server/src/routes/transactions.js
import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const txns = await Transaction.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const txn = new Transaction(req.body);
    const saved = await txn.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
