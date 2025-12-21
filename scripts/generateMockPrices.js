// scripts/generateMockPrices.js
import { randomId } from "../utils/randomId.js";

function generatePriceSeries(days = 30, start = 100) {
  const data = [];
  let price = start;
  for (let i = 0; i < days; i += 1) {
    const change = (Math.random() - 0.5) * 4;
    price = Math.max(1, price + change);
    data.push({ id: randomId("pt"), day: i + 1, close: Number(price.toFixed(2)) });
  }
  return data;
}

console.log(JSON.stringify(generatePriceSeries(), null, 2));
