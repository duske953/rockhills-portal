export function calculateApprovedAmount(
  expenses: Array<any>,
  lodgeAmount: Array<any>,
  drinkSales: any
) {
  const totalExpenses = expenses.reduce((acc, expense) => {
    return acc + expense.amount;
  }, 0);

  const lodgeCash = lodgeAmount.find((lodge) => lodge.paymentType === 'CASH');
  const lodgePos = lodgeAmount.find((lodge) => lodge.paymentType === 'POS');
  const totalCash =
    (lodgeCash?._sum.amount || 0) +
    (drinkSales?.cash || 0) -
    (totalExpenses || 0);
  const totalPos = (drinkSales?.pos || 0) + (lodgePos?._sum.amount || 0);

  return {
    totalCash,
    totalPos,
  };

  // console.log(availableCash);
  // return (lodgePos?._sum.amount || 0) + availableCash + totalDrinkSales;
}
