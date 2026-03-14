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
import {
  Sparkles,
  History,
  FileText,
  CheckCircle2,
  Home,
  Users,
  WalletMinimal,
  Activity,
} from 'lucide-react';
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
    <section className="pb-20 pt-8 px-6 lg:px-10 bg-slate-50/50 min-h-screen w-full overflow-x-hidden">
      <div className="w-full space-y-8">
        {/* Header Section - Full Width */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-6 border-slate-200">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-800 flex items-center gap-3">
              <span className="bg-primary text-white p-2.5 rounded-2xl shadow-lg shadow-primary/20">
                <Home size={24} />
              </span>
              Portal Management
            </h1>
            <p className="text-slate-500 font-bold pl-1 italic">
              &ldquo;Excellence is our standard.&rdquo;
            </p>
          </div>

          <LiveClock />
        </div>

        {/* Hero & Performance - Full Width Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 relative overflow-hidden bg-white rounded-[2rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
              <Sparkles size={250} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.15em]">
                    <Sparkles size={12} />
                    Active Duty
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-800">
                    Welcome,{' '}
                    <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent capitalize">
                      {activeUser?.name}
                    </span>
                  </h2>
                  <p className="text-slate-400 font-medium max-w-sm leading-relaxed">
                    Access real-time hotel metrics and manage guest
                    registrations with precision.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'h-12 px-6 rounded-2xl gap-3 font-black shadow-sm hover:shadow-lg hover:border-primary transition-all duration-300',
                    )}
                    href={`/rockins-history/?month=${moment().format(
                      'M',
                    )}&year=${moment().format('YYYY')}&worker=${activeUser.name}`}
                  >
                    <History className="w-5 h-5 text-primary" />
                    Duty History
                  </Link>

                  <Link
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'h-12 px-6 rounded-2xl gap-3 font-black shadow-sm hover:shadow-lg hover:border-primary transition-all duration-300',
                    )}
                    href={`/portal/account-report?acc=${activeUser.name}&month=${
                      new Date().getMonth() + 1
                    }&year=${new Date().getFullYear()}`}
                  >
                    <FileText className="w-5 h-5 text-primary" />
                    Account Reports
                  </Link>

                  <div className="flex items-center border-l pl-4 ml-2">
                    <DeregisterRoom />
                  </div>
                </div>
              </div>

              {/* Quick Summary Circle or Icon can stay here or move to metrics */}
            </div>
          </div>

          <div className="lg:col-span-4 bg-primary rounded-[2rem] p-10 text-white shadow-2xl shadow-primary/30 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <WalletMinimal size={200} />
            </div>

            <div className="space-y-2 relative z-10">
              <p className="text-primary-foreground/60 font-black uppercase tracking-[0.2em] text-[10px]">
                Session Analytics
              </p>
              <h3 className="text-3xl font-black flex items-center gap-2">
                Shift Metrics
              </h3>
            </div>

            <div className="space-y-5 mt-10 relative z-10">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-md flex items-center justify-between border border-white/10">
                <div>
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1.5">
                    Shift Collection
                  </p>
                  <p className="text-3xl font-black flex items-center gap-1.5 tabular-nums">
                    <FaNairaSign className="text-lg opacity-90" />
                    {new Intl.NumberFormat().format(shiftTotal)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <WalletMinimal className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-md border border-white/10">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Available
                  </p>
                  <p className="text-2xl font-black flex items-center gap-2">
                    {availableRooms}
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  </p>
                </div>
                <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-md border border-white/10">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Occupied
                  </p>
                  <p className="text-2xl font-black flex items-center gap-2">
                    {occupiedRooms}
                    <Users className="w-4 h-4 text-amber-300" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Status - Full Width */}
        <div className="w-full">
          <RoomStatusGrid rooms={allRooms} />
        </div>

        {/* Dashboard Grid - Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-4 px-2">
              <div className="h-1 w-12 bg-primary rounded-full" />
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                Registration Desk
              </h3>
            </div>
            <RegisterCustomer />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <RecentActivity bookings={recentCustomers} />

            <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 text-primary">
                <Activity size={120} />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Sparkles size={18} />
                </div>
                <h4 className="font-black text-slate-800 uppercase tracking-tight mb-2">
                  Pro Tip
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                  &ldquo;Verify guest identification documents during check-in
                  to maintain the highest security standards for RockHills
                  Luxury Suites.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="fixed bottom-6 left-6 text-[10px] text-slate-400 uppercase font-black bg-white/90 backdrop-blur-lg px-4 py-2 rounded-full border border-slate-100 shadow-xl z-50">
        Enterprise Management Portal • v2.1 • ROCKHILLS
      </p>
    </section>
  );
}
