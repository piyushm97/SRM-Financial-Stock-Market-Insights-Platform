// utils/seasonality.js
export function seasonality(prices, dates) {
  const monthlyReturns = {};
  
  for (let i = 1; i < prices.length; i++) {
    const month = new Date(dates[i]).getMonth();
    const ret = ((prices[i] - prices[i - 1]) / prices[i - 1]) * 100;
    if (!monthlyReturns[month]) monthlyReturns[month] = [];
    monthlyReturns[month].push(ret);
  }
  
  const avgByMonth = {};
  Object.keys(monthlyReturns).forEach(m => {
    const returns = monthlyReturns[m];
    avgByMonth[m] = Number((returns.reduce((s, r) => s + r, 0) / returns.length).toFixed(2));
  });
  
  return avgByMonth;
}
