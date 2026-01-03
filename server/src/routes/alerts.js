// server/src/routes/alerts.js
import express from "express";
import Alert from "../models/Alert.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.params.userId, triggered: false });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const alert = new Alert(req.body);
    const saved = await alert.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
