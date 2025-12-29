// server/src/models/Portfolio.js
import mongoose from "mongoose";

const positionSchema = new mongoose.Schema({
  symbol: String,
  quantity: Number,
  avgCost: Number
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, default: "My Portfolio" },
  cash: { type: Number, default: 100000 },
  positions: [positionSchema]
}, { timestamps: true });

export default mongoose.model("Portfolio", portfolioSchema);
