// server/src/utils/validSymbol.js
export function validSymbol(symbol) {
  return typeof symbol === "string" && /^[A-Z]{1,5}$/.test(symbol);
}
