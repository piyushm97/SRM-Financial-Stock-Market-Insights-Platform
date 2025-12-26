// scripts/seedSamplePositions.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Stock from "../server/src/models/Stock.js";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await Stock.deleteMany({});
  await Stock.insertMany([
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "TSLA", name: "Tesla Inc." }
  ]);
  console.log("Seeded sample stocks.");
  await mongoose.disconnect();
}

run().catch((err) => console.error(err));
