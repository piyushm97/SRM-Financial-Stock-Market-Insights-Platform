// server/src/services/alertChecker.js
import Alert from "../models/Alert.js";
import { fetchPrice } from "./fetchPrice.js";

export async function checkAlerts() {
  try {
    const pending = await Alert.find({ triggered: false });
    
    for (const alert of pending) {
      const quote = await fetchPrice(alert.symbol);
      if (!quote.price) continue;
      
      const shouldTrigger =
        (alert.condition === "ABOVE" && quote.price >= alert.targetPrice) ||
        (alert.condition === "BELOW" && quote.price <= alert.targetPrice);
      
      if (shouldTrigger) {
        alert.triggered = true;
        await alert.save();
        console.log(`Alert triggered: ${alert.symbol} ${alert.condition} ${alert.targetPrice}`);
      }
    }
  } catch (err) {
    console.error("Alert check failed:", err.message);
  }
}
