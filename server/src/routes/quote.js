// server/src/routes/quote.js
import express from "express";
import { fetchPrice } from "../services/fetchPrice.js";

const router = express.Router();

router.get("/:symbol", async (req, res) => {
  try {
    const data = await fetchPrice(req.params.symbol.toUpperCase());
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
