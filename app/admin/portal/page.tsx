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
    <div className="pb-20 pt-12 px-6 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Command <span className="text-slate-500 font-medium">Center</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Administrative tools for system operations and personnel management.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
          <div className="flex -space-x-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border border-white bg-slate-200 flex items-center justify-center"
              >
                <Users size={10} className="text-slate-500" />
              </div>
            ))}
          </div>
          <div className="pl-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Registered Accounts
            </p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {totalWorkers} Total
            </p>
          </div>
        </div>
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Approve Account Card */}
        <Link
          href="/admin/portal/approve-account"
          className="group relative bg-white rounded-xl p-8 border border-slate-100 hover:border-slate-300 transition-colors"
        >
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Approve Account
              </h3>
              <p className="text-slate-500 text-xs mt-2 font-medium leading-relaxed">
                Verify and authenticate worker audit trails for the current
                session.
              </p>
            </div>
            <div className="flex items-center gap-2 text-slate-900 text-[10px] font-bold uppercase tracking-widest pt-2">
              Access Tool <ArrowUpRight size={10} />
            </div>
          </div>
        </Link>

        {/* Delete Account Card */}
        <Link
          href="/admin/portal/deactivate-account"
          className="group relative bg-white rounded-xl p-8 border border-slate-100 hover:border-slate-300 transition-colors"
        >
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Delete Account
              </h3>
              <p className="text-slate-500 text-xs mt-2 font-medium leading-relaxed">
                Remove or deactivate personnel access from the system records.
              </p>
            </div>
            <div className="flex items-center gap-2 text-rose-600 text-[10px] font-bold uppercase tracking-widest pt-2">
              Access Tool <ArrowUpRight size={10} />
            </div>
          </div>
        </Link>

        {/* History Summary Card */}
        <Link
          href={`/rockins-history/?month=${moment().format('M')}&year=${moment().format('YYYY')}`}
          className="group relative bg-slate-50 rounded-xl p-8 border border-slate-100 hover:border-slate-300 transition-colors"
        >
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600">
              <History size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                System History
              </h3>
              <p className="text-slate-500 text-xs mt-2 font-medium leading-relaxed">
                View comprehensive historical data and performance metrics
                across all accounts.
              </p>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest pt-2">
              Access Tool <ArrowUpRight size={10} />
            </div>
          </div>
        </Link>
      </div>

      {/* Account Audit Section */}
      <div className="bg-slate-50 rounded-xl p-10 border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              View Account{' '}
              <span className="text-slate-500 font-medium">Report</span>
            </h2>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <AccountDropdown
                accounts={accounts}
                activeAcc={activeAccount?.name}
              />
              {activeAccount && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    Active: {activeAccount.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
