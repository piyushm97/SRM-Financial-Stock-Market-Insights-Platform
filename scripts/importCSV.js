// scripts/importCSV.js
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Stock from "../server/src/models/Stock.js";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const csv = fs.readFileSync("./data/prices.csv", "utf-8");
  const lines = csv.split("\n").slice(1);
  
  for (const line of lines) {
    const [symbol, date, close] = line.split(",");
    if (!symbol || !close) continue;
    
    await Stock.findOneAndUpdate(
      { symbol },
      { $push: { prices: { timestamp: new Date(date), close: Number(close) } } },
      { upsert: true }
    );
  }
  
  console.log("CSV import complete");
  await mongoose.disconnect();
}

run().catch(console.error);
