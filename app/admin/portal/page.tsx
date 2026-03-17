import prisma from '@/lib/prisma';
import Link from 'next/link';
import moment from 'moment';
import AccountDropdown from '../components/AccocuntDropdown';
import {
  ShieldCheck,
  Trash2,
  History,
  Users,
  LayoutDashboard,
  UserCheck,
  Activity,
  ArrowUpRight,
} from 'lucide-react';

export default async function Page() {
  const [accounts, activeAccount, totalWorkers] = await Promise.all([
    prisma.account.findMany({ select: { name: true } }),
    prisma.worker.findFirst({
      where: { isActive: true },
      orderBy: { checkInTime: 'desc' },
    }),
    prisma.account.count(),
  ]);

  return (
    <div className="pb-20 pt-12 px-6 max-sm:px-3 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
            <LayoutDashboard className="w-3 h-3" />
            Administrative Control
          </div>
          <h1 className="text-5xl font-black text-slate-800 tracking-tight">
            Command <span className="text-primary">Center</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Manage system operations, audit trail authentication, and personnel
            records.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center"
              >
                <Users size={12} className="text-slate-400" />
              </div>
            ))}
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-black text-slate-400 uppercase leading-none">
              Total Accounts
            </p>
            <p className="text-sm font-black text-slate-800">
              {totalWorkers} Registered
            </p>
          </div>
        </div>
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Approve Account Card */}
        <Link
          href="/admin/portal/approve-account"
          className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 transition-all duration-500"
        >
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:rotate-6 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">
                Approve Account
              </h3>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                Verify and authenticate worker audit trails for the current
                session.
              </p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest pt-4">
              Access Tool <ArrowUpRight size={12} />
            </div>
          </div>
        </Link>

        {/* Delete Account Card */}
        <Link
          href="/admin/portal/deactivate-account"
          className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-rose/10 hover:border-rose-200/30 transition-all duration-500"
        >
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-rose-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200 group-hover:rotate-6 transition-transform">
              <Trash2 size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">
                Delete Account
              </h3>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                Remove or deactivate personnel access from the organizational
                records.
              </p>
            </div>
            <div className="flex items-center gap-2 text-rose-600 text-[10px] font-black uppercase tracking-widest pt-4">
              Access Tool <ArrowUpRight size={12} />
            </div>
          </div>
        </Link>

        {/* History Summary Card */}
        <Link
          href={`/rockins-history/?month=${moment().format('M')}&year=${moment().format('YYYY')}`}
          className="group relative bg-slate-900 rounded-[2.5rem] p-8 overflow-hidden hover:shadow-2xl hover:shadow-slate-900/40 transition-all duration-500"
        >
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/20 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
              <History size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                RockHills Summary
              </h3>
              <p className="text-slate-400 text-sm mt-2 font-medium">
                View comprehensive historical data and performance metrics
                across all accounts.
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest pt-4">
              Access Tool <ArrowUpRight size={12} />
            </div>
          </div>
        </Link>
      </div>

      {/* Account Audit Section */}
      <div className="bg-white max-sm:p-5 rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 p-12 opacity-5">
          <UserCheck size={200} />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider">
              <Activity size={12} />
              Session Monitoring
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
              Audit Trails & <br /> Account{' '}
              <span className="text-indigo-600">Reports</span>
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Select an account to review detailed shift logs, financial
              summaries, and performance metrics for the current month.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <AccountDropdown
                accounts={accounts}
                activeAcc={activeAccount?.name}
              />
              {activeAccount && (
                <div className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                    Currently Active: {activeAccount.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                Live Insights
              </h4>
              <span className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                Updated just now
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <LayoutDashboard size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">
                    System is healthy
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                    All services operational
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">
                    Pending Approvals
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                    Action required in audit section
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
