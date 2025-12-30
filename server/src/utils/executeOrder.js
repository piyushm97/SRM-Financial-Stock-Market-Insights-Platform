// server/src/utils/executeOrder.js
export function executeOrder(portfolio, order, price) {
  const { symbol, side, quantity } = order;
  const cost = quantity * price;

  if (side === "BUY") {
    if (portfolio.cash < cost) throw new Error("Insufficient cash");
    portfolio.cash -= cost;
    const pos = portfolio.positions.find((p) => p.symbol === symbol);
    if (pos) {
      const totalCost = pos.quantity * pos.avgCost + cost;
      pos.quantity += quantity;
      pos.avgCost = totalCost / pos.quantity;
    } else {
      portfolio.positions.push({ symbol, quantity, avgCost: price });
    }
  } else {
    const pos = portfolio.positions.find((p) => p.symbol === symbol);
    if (!pos || pos.quantity < quantity) throw new Error("Insufficient shares");
    pos.quantity -= quantity;
    portfolio.cash += cost;
    if (pos.quantity === 0) {
      portfolio.positions = portfolio.positions.filter((p) => p.symbol !== symbol);
    }
  }
  return portfolio;
}
