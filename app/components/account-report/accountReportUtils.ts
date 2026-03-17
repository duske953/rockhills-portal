export interface LodgeSale {
  paymentType: 'CASH' | 'POS';
  _sum: {
    amount: number;
  };
}

export interface DrinkSales {
  cash?: number;
  pos?: number;
}

export function calculateStats(reports: any[]) {
  let totalLodgePos = 0;
  let totalLodgeCash = 0;
  let totalDrinkPos = 0;
  let totalDrinkCash = 0;
  let totalExpenses = 0;
  let totalCustomers = 0;
  const customerMap = new Map<string, { count: number; name: string }>();

  reports.forEach((report: any) => {
    const lodgePos = report.lodgeAmount.reduce(
      (acc: number, s: any) =>
        s.paymentType === 'POS' ? acc + (s._sum.amount || 0) : acc,
      0,
    );
    const lodgeCash = report.lodgeAmount.reduce(
      (acc: number, s: any) =>
        s.paymentType === 'CASH' ? acc + (s._sum.amount || 0) : acc,
      0,
    );
    const drinkPos = report.drinkSales?.pos || 0;
    const drinkCash = report.drinkSales?.cash || 0;

    const reportExpenses =
      report.expenses?.reduce(
        (acc: number, e: any) => acc + (Number(e.amount) || 0),
        0,
      ) || 0;

    totalLodgePos += lodgePos;
    totalLodgeCash += lodgeCash;
    totalDrinkPos += drinkPos;
    totalDrinkCash += drinkCash;
    totalExpenses += reportExpenses;
    totalCustomers += report.customers.length;

    report.customers.forEach((c: any) => {
      const phone = c.phoneNumber?.toString().replace(/\s+/g, '');
      if (!phone) return;
      const current = customerMap.get(phone) || { count: 0, name: c.name };
      customerMap.set(phone, { count: current.count + 1, name: c.name });
    });
  });

  let topCustomer = null;
  let maxVisits = 0;

  for (const [_, data] of customerMap.entries()) {
    if (data.count > maxVisits) {
      maxVisits = data.count;
      topCustomer = data.name;
    }
  }

  const totalRevenue =
    totalLodgePos + totalLodgeCash + totalDrinkPos + totalDrinkCash;

  return {
    totalLodgePos,
    totalLodgeCash,
    totalDrinkPos,
    totalDrinkCash,
    totalPos: totalLodgePos + totalDrinkPos,
    totalCash: totalLodgeCash + totalDrinkCash,
    totalRevenue,
    totalExpenses,
    netRevenue: totalRevenue - totalExpenses,
    totalCustomers,
    reportCount: reports.length || 1,
    allReports: reports,
    mvp: maxVisits > 1 ? { name: topCustomer, count: maxVisits } : null,
  };
}

export function calculateTotalCashSales(
  lodgeSales: LodgeSale[],
  drinkSales: DrinkSales,
): {
  lodgePos: number;
  lodgeCash: number;
  drinkPos: number;
  drinkCash: number;
} {
  const lodgeCash = lodgeSales.reduce(
    (acc, s) => (s.paymentType === 'CASH' ? acc + (s._sum.amount || 0) : acc),
    0,
  );
  const lodgePos = lodgeSales.reduce(
    (acc, s) => (s.paymentType === 'POS' ? acc + (s._sum.amount || 0) : acc),
    0,
  );
  const drinkCash = drinkSales?.cash || 0;
  const drinkPos = drinkSales?.pos || 0;

  return { lodgePos, lodgeCash, drinkPos, drinkCash };
}

export function objectToArrObj(obj: any) {
  if (!obj) return [];
  return Object.entries(obj)
    .map(([key, value]) => ({ amount: value as number, method: key }))
    .filter((res) => res.amount > 0);
}

export function getInsights(customers: any[], stats: any) {
  const insights = [];
  const total = stats.pos + stats.cash;
  if (total === 0) return [];

  const posRate = (stats.pos / total) * 100;
  const cashRate = (stats.cash / total) * 100;
  const shortRestCount = customers.filter(
    (c) => c.stayType === 'SHORT-REST',
  ).length;
  const shortRestRate = (shortRestCount / customers.length) * 100;

  if (customers.length > 8) {
    insights.push({
      label: 'High Volume',
      icon: 'Users',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    });
  }
  if (posRate > 70) {
    insights.push({
      label: 'POS Performance',
      icon: 'CreditCard',
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    });
  }
  if (cashRate > 70) {
    insights.push({
      label: 'Cash Intensive',
      icon: 'Wallet',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    });
  }
  if (shortRestRate > 50) {
    insights.push({
      label: 'Rapid Turnover',
      icon: 'Zap',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    });
  }
  if (total > 150000) {
    insights.push({
      label: 'Premium Shift',
      icon: 'TrendingUp',
      color: 'bg-primary/10 text-primary border-primary/20',
    });
  }
  if (total > 250000 && customers.length > 12) {
    insights.push({
      label: 'Elite Host',
      icon: 'Gem',
      color:
        'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-transparent shadow-lg shadow-violet-500/20',
    });
  } else if (total > 200000) {
    insights.push({
      label: 'Gold Performer',
      icon: 'Award',
      color: 'bg-amber-400 text-amber-950 border-amber-500/20',
    });
  }

  return insights;
}
