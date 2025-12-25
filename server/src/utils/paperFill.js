// server/src/utils/paperFill.js
export function paperFill(order, marketPrice) {
  if (order.status !== "PENDING") return order;
  const fillPrice = marketPrice ?? order.price;
  return {
    ...order,
    status: "FILLED",
    filledPrice: fillPrice,
    filledAt: new Date().toISOString()
  };
}
