import prisma from '@/lib/prisma';
import moment from 'moment';
import { getCookies } from '../utils/cookies';
import AccountDateFilter from '../components/AccountDateFilter';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { ShieldAlert, Info } from 'lucide-react';

async function getWorkers(
  startDate: Date,
  endDate: Date,
  name: string | undefined,
) {
  return await prisma.worker.findMany({
    where: {
      name: name || undefined,
      checkInTime: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      customers: true,
    },
    orderBy: { checkInTime: 'asc' },
  });
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ worker?: string; month: string; year: string }>;
}) {
  const params = await searchParams;
  const workerName = params.worker;
  const month = params.month;
  const year = params.year;

  const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD')
    .startOf('month')
    .toDate();
  const endDate = moment(startDate).endOf('month').toDate();

  if (!month || !year) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Info className="w-12 h-12 text-slate-300" />
        <p className="text-slate-500 font-medium">
          Please select a month and year to view history.
        </p>
      </div>
    );
  }

  const authAdmin = await getCookies('auth-admin');
  const authWorker = await getCookies('authenticated');

  let accounts: { name: string }[] = [];
  if (authAdmin && !authWorker) {
    accounts = await prisma.account.findMany({ select: { name: true } });
  } else if (authWorker) {
    accounts = await prisma.account.findMany({
      where: { name: authWorker.value.trim() },
      select: { name: true },
    });
  }

  const workers = await getWorkers(startDate, endDate, undefined);
  const selectedWorkerData = workerName
    ? workers.filter((w) => w.name.toLowerCase() === workerName.toLowerCase())
    : workers;

  const totalRooms = await prisma.rooms.count();
  const isWorkerApproved =
    workers.length > 0 && workers.every((w) => w.approved === true);
  const isCurrWorkerApproved =
    selectedWorkerData.length > 0 &&
    selectedWorkerData.every((w) => w.approved === true);

  // Data processing for analytics
  const allCustomers = workers.flatMap((w) => w.customers);

  // Financial Breakdowns
  const totalLodgeRevenue = allCustomers.reduce((acc, c) => acc + c.amount, 0);

  const totalDrinkRevenue = workers.reduce((acc, w) => {
    const drinks = w.drinkSales as { pos: number; cash: number } | null;
    return acc + (drinks ? drinks.pos + drinks.cash : 0);
  }, 0);

  const totalExpenses = workers.reduce((acc, w) => {
    const expenses = Array.isArray(w.expenses) ? w.expenses : [];
    return (
      acc +
      expenses.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0)
    );
  }, 0);

  const netRevenue = totalLodgeRevenue + totalDrinkRevenue - totalExpenses;

  // Selected Worker Financials (if applicable)
  const workerLodgeRevenue = selectedWorkerData
    .flatMap((w) => w.customers)
    .reduce((acc, c) => acc + c.amount, 0);
  const workerDrinkRevenue = selectedWorkerData.reduce((acc, w) => {
    const drinks = w.drinkSales as { pos: number; cash: number } | null;
    return acc + (drinks ? drinks.pos + drinks.cash : 0);
  }, 0);
  const workerExpenses = selectedWorkerData.reduce((acc, w) => {
    const expenses = Array.isArray(w.expenses) ? w.expenses : [];
    return (
      acc +
      expenses.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0)
    );
  }, 0);

  // Daily Revenue for Trend Chart
  const dailyRevenue: Record<string, number> = {};
  allCustomers.forEach((c) => {
    const day = moment(c.checkInTime).format('DD');
    dailyRevenue[day] = (dailyRevenue[day] || 0) + c.amount;
  });

  const trendData = Object.entries(dailyRevenue)
    .map(([day, amount]) => ({ day, amount }))
    .sort((a, b) => parseInt(a.day) - parseInt(b.day));

  // Room Performance

  const roomPerformance = await prisma.customers.groupBy({
    where: {
      checkInTime: {
        startsWith: `${year}-${month.padStart(2, '0')}`,
      },
    },
    by: ['room'],
    _count: {
      room: true,
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _count: {
        room: 'desc',
      },
    },
  });

  const workerDays = await prisma.worker.groupBy({
    where: {
      checkInTime: {
        gte: startDate,
        lte: endDate,
      },
    },
    by: ['name'],
    _count: {
      name: true,
    },
    orderBy: {
      _count: {
        name: 'desc',
      },
    },
  });

  const roomData = roomPerformance.map((room) => ({
    room: `Room ${room.room}`,
    revenue: room._sum.amount,
    bookings: room._count.room,
  }));

  // Busiest Day (Based on Guest Count)
  const dailyGuestCount: Record<string, number> = {};
  allCustomers.forEach((c) => {
    const day = moment(c.checkInTime).format('DD');
    dailyGuestCount[day] = (dailyGuestCount[day] || 0) + 1;
  });

  const busiestDayEntry = Object.entries(dailyGuestCount).reduce(
    (prev, current) => (current[1] > prev[1] ? current : prev),
    ['0', 0],
  );

  const peakDay = {
    day: busiestDayEntry[0],
    amount: dailyRevenue[busiestDayEntry[0]] || 0,
    guests: busiestDayEntry[1],
  };

  // Stay Type Distribution
  const stayTypeData = [
    {
      name: 'Short Stay',
      value: allCustomers.filter((c) =>
        c.stayType.toLowerCase().includes('short'),
      ).length,
    },
    {
      name: 'Full Stay',
      value: allCustomers.filter((c) =>
        c.stayType.toLowerCase().includes('full'),
      ).length,
    },
  ].filter((d) => d.value > 0);

  // Payment Method Breakdown
  const paymentMethodData = [
    {
      name: 'Cash',
      value: allCustomers
        .filter((c) => c.paymentType.toLowerCase() === 'cash')
        .reduce((acc, c) => acc + c.amount, 0),
    },
    {
      name: 'POS',
      value: allCustomers
        .filter((c) => c.paymentType.toLowerCase() === 'pos')
        .reduce((acc, c) => acc + c.amount, 0),
    },
  ].filter((d) => d.value > 0);

  // Worker Performance
  const workerPerformance = workers.reduce((acc: Record<string, number>, w) => {
    const revenue = w.customers.reduce((sum, c) => sum + c.amount, 0);
    acc[w.name] = (acc[w.name] || 0) + revenue;
    return acc;
  }, {});

  const performanceData = Object.entries(workerPerformance)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const formatMonth = moment()
    .month(+month - 1)
    .format('MMMM');

  const selectedWorkerDays = workerName
    ? workerDays.find((w) => w.name.toLowerCase() === workerName.toLowerCase())
        ?._count.name || 0
    : 0;

  return (
    <section className="pb-20 pt-8 px-6 lg:px-10 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8 border-slate-200">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-800">
              RockHills <span className="text-primary">Insights</span>
            </h1>
            <p className="text-slate-500 font-medium italic">
              Historical performance data for {formatMonth}, {year}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <AccountDateFilter
              type={workerName ? 'worker' : null}
              value={workerName}
            />
          </div>
        </div>

        {!isWorkerApproved && workers.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-8 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
              <ShieldAlert size={32} />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-black text-slate-800">
                Approvals Pending
              </h3>
              <p className="text-slate-500 font-medium">
                {authAdmin
                  ? 'Some accounts are awaiting approval. Please approve all records to unlock comprehensive monthly analytics.'
                  : 'The monthly analytics are currently locked awaiting administrative approval. Please check back later.'}
              </p>
            </div>
          </div>
        )}

        {workers.length === 0 && (
          <div className="bg-white border border-slate-100 rounded-[2rem] p-20 flex flex-col items-center text-center space-y-4 shadow-sm">
            <Info className="w-16 h-16 text-slate-200" />
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-800">
                No Records Found
              </h3>
              <p className="text-slate-500 font-medium">
                There is no historical data available for the selected period.
              </p>
            </div>
          </div>
        )}

        {isWorkerApproved && workers.length > 0 && (
          <AnalyticsDashboard
            data={{
              trendData,
              stayTypeData,
              paymentMethodData,
              performanceData,
              roomData,
              workerDays: workerDays.map((w) => ({
                name: w.name,
                days: w._count.name,
              })),
              peakDay: {
                day: peakDay.day,
                amount: peakDay.amount,
              },
              totalLodgeRevenue,
              totalDrinkRevenue,
              totalExpenses,
              netRevenue,
              totalGuests: allCustomers.length,
              occupancyRate: Math.min(
                100,
                (allCustomers.length / (totalRooms * 30)) * 100,
              ),
              avgDailyRevenue: (totalLodgeRevenue + totalDrinkRevenue) / 30,
              workers: accounts,
              selectedWorker: workerName,
              isCurrWorkerApproved,
              selectedWorkerData: {
                name: workerName || '',
                lodgeRevenue: workerLodgeRevenue,
                drinkRevenue: workerDrinkRevenue,
                expenses: workerExpenses,
                netRevenue:
                  workerLodgeRevenue + workerDrinkRevenue - workerExpenses,
                guests: selectedWorkerData.flatMap((w) => w.customers).length,
                daysWorked: selectedWorkerDays,
                approved: isCurrWorkerApproved,
              },
            }}
            month={formatMonth}
            year={year}
          />
        )}
      </div>
    </section>
  );
}
