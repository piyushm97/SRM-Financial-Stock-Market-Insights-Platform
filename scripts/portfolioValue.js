// scripts/portfolioValue.js
import { dailySummary } from "../server/src/utils/dailySummary.js";

const sample = [
  { symbol: "AAPL", quantity: 5, lastPrice: 195, prevClose: 193 },
  { symbol: "TSLA", quantity: 2, lastPrice: 250, prevClose: 248 }
];

const summary = dailySummary(sample);
console.log("SRM Financial sample portfolio:");
console.log(`Total value: $${summary.totalValue}`);
console.log(`Today's PnL: $${summary.todaysPnL}`);
