// utils/calcPnL.test.js
import { calcPnL } from "./calcPnL.js";

test("calculates profit correctly", () => {
  const result = calcPnL({ buyPrice: 100, currentPrice: 120, quantity: 5 });
  expect(result).toBe(100);
});
