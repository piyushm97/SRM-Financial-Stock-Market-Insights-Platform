// server/src/models/Watchlist.js
import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  symbols: [{ type: String, uppercase: true }]
}, { timestamps: true });

export default mongoose.model("Watchlist", watchlistSchema);
