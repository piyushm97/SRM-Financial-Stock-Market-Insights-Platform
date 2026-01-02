// scripts/backfillPrices.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Stock from "../server/src/models/Stock.js";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const symbols = ["AAPL", "TSLA", "GOOGL"];
  for (const sym of symbols) {
    const prices = Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      close: Number((Math.random() * 50 + 100).toFixed(2))
    }));
    
    await Stock.findOneAndUpdate(
      { symbol: sym },
      { $set: { prices } },
      { upsert: true }
    );
    console.log(`Backfilled ${sym}`);
  }
  
  await mongoose.disconnect();
}

run().catch(console.error);
