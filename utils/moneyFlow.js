// utils/moneyFlow.js
export function mfi(highs, lows, closes, volumes, period = 14) {
  if (closes.length < period + 1) return [];
  
  const typicalPrices = closes.map((c, i) => (highs[i] + lows[i] + c) / 3);
  const rawMoneyFlow = typicalPrices.map((tp, i) => tp * volumes[i]);
  
  const mfiValues = [];
  for (let i = period; i < closes.length; i++) {
    let positiveFlow = 0;
    let negativeFlow = 0;
    
    for (let j = 0; j < period; j++) {
      const idx = i - period + j + 1;
      if (typicalPrices[idx] > typicalPrices[idx - 1]) {
        positiveFlow += rawMoneyFlow[idx];
      } else {
        negativeFlow += rawMoneyFlow[idx];
      }
    }
    
    const moneyRatio = negativeFlow === 0 ? 100 : positiveFlow / negativeFlow;
    const mfi = 100 - (100 / (1 + moneyRatio));
    mfiValues.push(Number(mfi.toFixed(2)));
  }
  
  return mfiValues;
}
