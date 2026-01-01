// server/src/utils/generateOrderId.js
export function generateOrderId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 6);
  return `ORD_${timestamp}_${random}`.toUpperCase();
}
