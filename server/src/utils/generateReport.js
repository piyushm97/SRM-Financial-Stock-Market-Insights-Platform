// server/src/utils/generateReport.js
export function generateReport(portfolio, transactions) {
  const totalDeposits = transactions
    .filter(t => t.type === "DEPOSIT")
    .reduce((s, t) => s + t.amount, 0);
  
  const totalWithdrawals = transactions
    .filter(t => t.type === "WITHDRAWAL")
    .reduce((s, t) => s + t.amount, 0);
  
  const netCashFlow = totalDeposits - totalWithdrawals;
  const totalValue = portfolio.cash + portfolio.positions.reduce((s, p) => s + p.quantity * p.currentPrice, 0);
  const totalReturn = totalValue - netCashFlow;
  const returnPercent = netCashFlow === 0 ? 0 : (totalReturn / netCashFlow) * 100;
  
  return {
    totalValue: Number(totalValue.toFixed(2)),
    netCashFlow: Number(netCashFlow.toFixed(2)),
    totalReturn: Number(totalReturn.toFixed(2)),
    returnPercent: Number(returnPercent.toFixed(2))
  };
}
