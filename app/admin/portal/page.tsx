import prisma from '@/lib/prisma';
import Link from 'next/link';
import moment from 'moment';
import AccountDropdown from '../components/AccocuntDropdown';

export default async function Page() {
  const [accounts, activeAccount, totalCustomers, allCustomers, allWorkers] = await Promise.all([
    prisma.account.findMany({ select: { name: true } }),
    prisma.worker.findFirst({
      where: { isActive: true },
      orderBy: { checkInTime: 'desc' },
    }),
    prisma.customers.count(),
    prisma.customers.findMany({ select: { amount: true } }),
    prisma.worker.findMany({ select: { expenses: true, drinkSales: true } }),
  ]);

  const totalRevenue = allCustomers.reduce((acc, c) => acc + c.amount, 0);
  const totalDrinkRevenue = allWorkers.reduce((acc, w) => {
    const drinks = w.drinkSales as { cash: number; pos: number } | null;
    return acc + (drinks ? drinks.pos + drinks.cash : 0);
  }, 0);
  const totalExpenses = allWorkers.reduce((acc, w) => {
    const expenses = Array.isArray(w.expenses) ? w.expenses : [];
    return acc + expenses.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);
  }, 0);

  return (
    <div className="pb-20 pt-12 px-6 max-w-xl mx-auto">
      <div className="space-y-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Admin
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            {activeAccount ? `${activeAccount.name} on shift` : 'No active shift'}
          </p>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center py-4">
            <p className="text-2xl font-bold text-slate-900">{totalCustomers}</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Customers</p>
          </div>
          <div className="text-center py-4">
            <p className="text-2xl font-bold text-slate-900">&#8358;{new Intl.NumberFormat().format(totalRevenue + totalDrinkRevenue)}</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Total Revenue</p>
          </div>
          <div className="text-center py-4">
            <p className="text-2xl font-bold text-slate-900">&#8358;{new Intl.NumberFormat().format(totalExpenses)}</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Total Expenses</p>
          </div>
          <div className="text-center py-4">
            <p className="text-2xl font-bold text-slate-900">&#8358;{new Intl.NumberFormat().format(totalRevenue + totalDrinkRevenue - totalExpenses)}</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Net Revenue</p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/admin/portal/approve-account"
            className="block w-full py-3 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold tracking-wide hover:bg-slate-50 transition-colors text-center"
          >
            Approve Accounts
          </Link>
          <Link
            href="/admin/portal/deactivate-account"
            className="block w-full py-3 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold tracking-wide hover:bg-slate-50 transition-colors text-center"
          >
            Deactivate Accounts
          </Link>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400 pt-4">
            Account Reports
          </h2>
          <AccountDropdown accounts={accounts} activeAcc={activeAccount?.name} />
          <Link
            href={`/rockins-history/?month=${moment().format('M')}&year=${moment().format('YYYY')}`}
            className="block w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-slate-800 transition-colors text-center"
          >
            System History
          </Link>
        </div>
      </div>
    </div>
  );
}
