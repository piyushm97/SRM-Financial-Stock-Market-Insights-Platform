// utils/beta.js
export function beta(stockReturns, marketReturns) {
  if (stockReturns.length !== marketReturns.length || stockReturns.length < 2) {
    return 1;
  }
  const meanStock = stockReturns.reduce((s, r) => s + r, 0) / stockReturns.length;
  const meanMarket = marketReturns.reduce((s, r) => s + r, 0) / marketReturns.length;
  
  let covariance = 0;
  let variance = 0;
  
  for (let i = 0; i < stockReturns.length; i++) {
    covariance += (stockReturns[i] - meanStock) * (marketReturns[i] - meanMarket);
    variance += Math.pow(marketReturns[i] - meanMarket, 2);
  }
  
  return variance === 0 ? 1 : Number((covariance / variance).toFixed(3));
}
