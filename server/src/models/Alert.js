// server/src/models/Alert.js
import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  symbol: { type: String, required: true, uppercase: true },
  condition: { type: String, enum: ["ABOVE", "BELOW"], required: true },
  targetPrice: { type: Number, required: true },
  triggered: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Alert", alertSchema);
