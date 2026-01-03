// utils/calmar.js
import { maxDrawdown } from "./maxDrawdown.js";

export function calmar(returns, values) {
  const annualReturn = returns.reduce((s, r) => s + r, 0) / returns.length * 252;
  const mdd = maxDrawdown(values);
  return mdd === 0 ? Infinity : Number((annualReturn / mdd).toFixed(3));
}
