import prisma from '@/lib/prisma';
import Link from 'next/link';
import { cn } from '../lib/utils';
import { buttonVariants } from '../components/ui/button';
import DeregisterRoom from './components/DeRegisterRoom';
import { getCookies } from '../utils/cookies';
import TemporaryLogin from './components/TemporaryLogin';
import { redirect } from 'next/navigation';
import RegisterCustomer from './components/RegisterCustomer';
import moment from 'moment';
import { History, FileText } from 'lucide-react';
import LiveClock from './components/LiveClock';
import RoomStatusGrid from './components/RoomStatusGrid';
import RecentActivity from './components/RecentActivity';
import { FaNairaSign } from 'react-icons/fa6';

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

  const [allRooms, recentCustomers] = await Promise.all([
    prisma.rooms.findMany({
      orderBy: { room: 'asc' },
    }),
    prisma.customers.findMany({
      where: { workerId: activeUser.id },
      take: 5,
      orderBy: { id: 'desc' },
    }),
  ]);

  const occupiedRooms = allRooms.filter((r) => r.booked).length;
  const availableRooms = allRooms.length - occupiedRooms;
  const shiftTotal = recentCustomers.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  return (
    <section className="pb-20 pt-8 px-6 lg:px-10 bg-white min-h-screen w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-6 border-slate-100">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Portal{' '}
              <span className="text-slate-500 font-medium">Management</span>
            </h1>
          </div>

          <LiveClock />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-50 rounded-xl p-8 border border-slate-100">
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  Active Session
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                  Welcome,{' '}
                  <span className="text-slate-500 capitalize">
                    {activeUser?.name}
                  </span>
                </h2>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-10 px-5 rounded-lg gap-2 font-bold text-xs',
                  )}
                  href={`/rockins-history/?month=${moment().format('M')}&year=${moment().format('YYYY')}&worker=${activeUser.name}`}
                >
                  <History size={14} />
                  Duty History
                </Link>

                <Link
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-10 px-5 rounded-lg gap-2 font-bold text-xs',
                  )}
                  href={`/portal/account-report?acc=${activeUser.name}&month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`}
                >
                  <FileText size={14} />
                  Account Reports
                </Link>

                <div className="flex items-center border-l border-slate-200 pl-3">
                  <DeregisterRoom />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900 rounded-xl p-8 text-white flex flex-col justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                Shift Analytics
              </p>
              <h3 className="text-xl font-bold">Performance Summary</h3>
            </div>

            <div className="space-y-4 mt-8">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Current Collection
                </p>
                <p className="text-3xl font-bold flex items-center gap-1.5 tabular-nums">
                  <FaNairaSign className="text-lg opacity-40" />
                  {new Intl.NumberFormat().format(shiftTotal)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1">
                    Available
                  </p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    {availableRooms}
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1">
                    Occupied
                  </p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    {occupiedRooms}
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <RoomStatusGrid rooms={allRooms} />
        </div>
        <div className="">
          <div className=" space-y-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest">
                Registration Desk
              </h3>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            <RegisterCustomer />
          </div>

          <div className="lg:col-span-4 space-y-10">
            <RecentActivity bookings={recentCustomers} />
            {/* 
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-3">
                Security Protocol
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Verify guest identification documents during check-in to
                maintain the highest security standards for RockHills Luxury
                Suites.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
