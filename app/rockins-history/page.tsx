import prisma from '@/lib/prisma';
import moment from 'moment';
import AccountMonthlyReport from '../admin/components/AccountMonthlyReport';
import { getCookies } from '../utils/cookies';
import { DisplayAmount } from './components/DisplayAmount';
import AccountDateFilter from '../components/AccountDateFilter';

async function getWorkers(month: string, name: any, year: string) {
  const startDate = moment(`${year}-${month}-01`).toDate();
  const endDate = moment(startDate).add(1, 'month').toDate();
  return await prisma.worker.findMany({
    where: {
      name,
      checkInTime: {
        gte: startDate,
        lt: endDate,
        // start of September
      },
    },
    include: { customers: name ? true : false },
  });
}

export default async function Page({
  searchParams,
}: {
  searchParams: { worker?: string; month: string; year: string };
}) {
  const workerName = (await searchParams).worker;
  const month = (await searchParams).month;
  const year = (await searchParams).year;
  const authAdmin = await getCookies('auth-admin');
  const authWorker = await getCookies('authenticated');
  if (!month || !year) return <div>ken</div>;
  let account;
  if (authAdmin && !authWorker) {
    account = await prisma.account.findMany({ select: { name: true } });
  }

  if (!authAdmin && authWorker) {
    account = await prisma.account.findMany({
      where: { name: authWorker.value.trim() },
      select: { name: true },
    });
  }

  // if (authAdmin && authWorker) {
  //   return [];
  // }

  const worker = await getWorkers(month, workerName || '', year);
  const workers = await getWorkers(month, {}, year);

  const totalLodgers = await prisma.customers.findMany({
    where: {
      checkInTime: {
        startsWith: `${year}-${+month <= 9 ? `0${month}` : month}`,
      },
    },
  });
  const totalLodgeRevenue = totalLodgers.reduce(
    (acc, lodger) => acc + lodger.amount,
    0
  );

  const isWorkerApproved = await workers.every((w) => w.approved === true);
  const isCurrWorkerApproved = await worker.every((w) => w.approved === true);
  const totalExpenses = workers.reduce((acc, worker) => {
    const expenses = Array.isArray(worker.expenses) ? worker.expenses : [];
    const workerTotal = expenses.reduce((sum: number, expense) => {
      if (!expense || typeof expense !== 'object') return sum;
      const amount = (expense as any).amount;
      const num =
        typeof amount === 'number' ? amount : parseFloat(String(amount || '0'));
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
    return acc + workerTotal;
  }, 0);

  const totalDrinkRevenue = workers
    .filter((worker) => worker.drinkSales)
    .reduce(
      (acc, worker) =>
        acc +
        ((worker.drinkSales as any)?.pos + (worker.drinkSales as any).cash),
      0
    );
  const formatMonth = moment()
    .month(+month - 1)
    .format('MMMM');

  return (
    <section>
      <div className="px-4 max-w-3xl mx-auto py-10">
        <div className="py-7">
          <AccountDateFilter
            type={workerName ? 'worker' : null}
            value={workerName}
          />
        </div>

        <h1 className="text-center text-4xl mb-5 font-bold text-gray-600 max-sm:text-2xl">
          Hotel Summary for {formatMonth}, {year}
        </h1>
        {!isWorkerApproved && (
          <p className="text-center text-xl mb-10 max-sm:text-lg">
            {authAdmin
              ? 'Please approve all account(s),'
              : 'Please contact admin'}{' '}
            to see the monthly report
          </p>
        )}
        {workers.length === 0 && (
          <p className="text-center text-xl mb-10">No data available</p>
        )}
        {isWorkerApproved && workers.length > 0 && (
          <div className="border-b-2 pb-3">
            <p className="mb-6 text-2xl font-bold border-b-2 pb-3">
              Month of {formatMonth}
            </p>
            <ul className="flex flex-col gap-7 text-xl">
              <li>
                You had <span className="font-bold">{totalLodgers.length}</span>{' '}
                customers for the month of {formatMonth}
              </li>
              <DisplayAmount type="Lodge Revenue" amount={totalLodgeRevenue} />
              <DisplayAmount type="Drink Revenue" amount={totalDrinkRevenue} />
              <DisplayAmount type="Expenses" amount={totalExpenses} />
              <DisplayAmount
                type="Revenue"
                amount={totalDrinkRevenue + totalLodgeRevenue}
              />
              <DisplayAmount
                type="Approved Revenue"
                amount={totalDrinkRevenue + totalLodgeRevenue - totalExpenses}
              />
            </ul>
          </div>
        )}

        <AccountMonthlyReport
          month={formatMonth}
          account={account ?? []}
          worker={worker as any}
          isCurrWorkerApproved={isCurrWorkerApproved}
        />
      </div>
    </section>
  );
}
