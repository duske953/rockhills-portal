import prisma from '@/lib/prisma';
import Link from 'next/link';
import { getCookies } from '../utils/cookies';
import TemporaryLogin from './components/TemporaryLogin';
import { redirect } from 'next/navigation';
import RegisterCustomer from './components/RegisterCustomer';
import moment from 'moment';
import RecentActivity from './components/RecentActivity';
import DeregisterRoom from './components/DeRegisterRoom';
import LiveClock from './components/LiveClock';

export default async function Page() {
  const temporaryWorker = await getCookies('temporary-login');
  const isUserAuth = await getCookies('authenticated');

  const activeUser = await prisma.worker.findFirst({
    take: 1,
    where: { isActive: true },
    orderBy: { checkInTime: 'desc' },
  });

  if (temporaryWorker && temporaryWorker.value)
    return <TemporaryLogin name={temporaryWorker.value} />;
  if (!isUserAuth?.value || !activeUser) redirect('/auth/login');
  if (
    activeUser.name.toLocaleLowerCase() !== isUserAuth.value.toLocaleLowerCase()
  )
    redirect('/auth/login');

  const recentCustomers = await prisma.customers.findMany({
      where: { workerId: activeUser.id },
      take: 5,
      orderBy: { id: 'desc' },
    });

  const shiftTotal = recentCustomers.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  return (
    <section className="pb-20 pt-8 px-6 min-h-screen w-full bg-white">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome,{' '}
            <span className="text-slate-500 capitalize">
              {activeUser.name}
            </span>
          </h1>
          <LiveClock />
        </div>

        {/* Quick Stats */}
        <div className="text-sm">
          <span className="text-slate-400">Collected: <span className="font-semibold text-slate-700">&#8358;{new Intl.NumberFormat().format(shiftTotal)}</span></span>
        </div>

        {/* Nav Links */}
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/rockins-history/?month=${moment().format('M')}&year=${moment().format('YYYY')}&worker=${activeUser.name}`}
            className="py-2 px-4 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold tracking-wide hover:bg-slate-50 transition-colors"
          >
            Duty History
          </Link>
          <Link
            href={`/portal/account-report?acc=${activeUser.name}&month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`}
            className="py-2 px-4 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold tracking-wide hover:bg-slate-50 transition-colors"
          >
            Account Reports
          </Link>
          <DeregisterRoom />
        </div>

        {/* Registration Form */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
            New Registration
          </h2>
          <RegisterCustomer />
        </div>

        {/* Recent Activity */}
        <RecentActivity bookings={recentCustomers} />

      </div>
    </section>
  );
}
