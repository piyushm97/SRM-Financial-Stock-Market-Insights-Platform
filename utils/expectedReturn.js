// utils/expectedReturn.js
export function expectedReturn(positions, predictions) {
  let totalExpected = 0;
  let totalValue = 0;
  
  positions.forEach(p => {
    const currentValue = p.quantity * p.currentPrice;
    const expected = predictions[p.symbol] || p.currentPrice;
    totalExpected += p.quantity * expected;
    totalValue += currentValue;
  });
  
  return totalValue === 0 ? 0 : Number((((totalExpected - totalValue) / totalValue) * 100).toFixed(2));
}
