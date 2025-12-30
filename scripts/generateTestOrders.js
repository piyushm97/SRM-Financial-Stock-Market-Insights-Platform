// scripts/generateTestOrders.js
import { randomId } from "../utils/randomId.js";

const symbols = ["AAPL", "TSLA", "GOOGL", "MSFT"];
const sides = ["BUY", "SELL"];

function generateOrder() {
  return {
    id: randomId("ord"),
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    side: sides[Math.floor(Math.random() * sides.length)],
    quantity: Math.floor(Math.random() * 10) + 1,
    price: Number((Math.random() * 500 + 50).toFixed(2)),
    status: "PENDING"
  };
}

const testOrders = Array.from({ length: 5 }, generateOrder);
console.log(JSON.stringify(testOrders, null, 2));
