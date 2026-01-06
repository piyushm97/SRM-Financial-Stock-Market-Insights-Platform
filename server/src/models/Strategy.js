// server/src/models/Strategy.js
import mongoose from "mongoose";

const strategySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: String,
  rules: [String],
  active: { type: Boolean, default: true },
  performance: {
    totalTrades: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    avgReturn: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model("Strategy", strategySchema);
