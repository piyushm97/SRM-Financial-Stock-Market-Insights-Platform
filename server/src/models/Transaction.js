// server/src/models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ["DEPOSIT", "WITHDRAWAL", "DIVIDEND", "FEE"], required: true },
  amount: { type: Number, required: true },
  description: String,
  balance: Number
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
