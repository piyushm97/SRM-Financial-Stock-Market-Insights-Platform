// utils/rebalance.js
export function rebalance(currentAllocation, targetAllocation, totalValue) {
  const trades = [];
  
  Object.keys(targetAllocation).forEach(symbol => {
    const target = (targetAllocation[symbol] / 100) * totalValue;
    const current = currentAllocation[symbol] || 0;
    const diff = target - current;
    
    if (Math.abs(diff) > 1) {
      trades.push({
        symbol,
        action: diff > 0 ? "BUY" : "SELL",
        value: Math.abs(diff)
      });
    }
  });
  
  return trades;
}
