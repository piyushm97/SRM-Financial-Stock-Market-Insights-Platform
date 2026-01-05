// scripts/calculateDividends.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Portfolio from "../server/src/models/Portfolio.js";
import Transaction from "../server/src/models/Transaction.js";

dotenv.config();

const dividendYields = {
  AAPL: 0.005,
  MSFT: 0.008,
  TSLA: 0
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const portfolios = await Portfolio.find();
  
  for (const pf of portfolios) {
    for (const pos of pf.positions) {
      const yield_rate = dividendYields[pos.symbol] || 0;
      if (yield_rate > 0) {
        const dividend = pos.quantity * pos.avgCost * yield_rate;
        await Transaction.create({
          userId: pf.userId,
          type: "DIVIDEND",
          amount: dividend,
          description: `${pos.symbol} dividend`
        });
        console.log(`Dividend: ${pf.userId} - $${dividend.toFixed(2)}`);
      }
    }
  }
  
  await mongoose.disconnect();
}

run().catch(console.error);
