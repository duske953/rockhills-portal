'use client';
import { cn } from '@/app/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Receipt,
  BarChart3,
  Activity,
  Users,
  Gem,
} from 'lucide-react';
import { FaNairaSign } from 'react-icons/fa6';

const MonthlyScoreboard = ({
  stats,
  prevStats,
}: {
  stats: any;
  prevStats: any;
}) => {
  const netGrowth =
    prevStats.netRevenue && prevStats.netRevenue !== 0
      ? ((stats.netRevenue - prevStats.netRevenue) /
          Math.abs(prevStats.netRevenue)) *
        100
      : 0;

  const isNetGrowth = netGrowth >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
      {/* Executive Net Performance Card */}
      <div className="bg-white border border-slate-100 rounded-xl p-6">
        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-4">
          Net Performance
        </p>
        <div className="flex items-end gap-2">
          <h3 className={cn("text-3xl font-bold tracking-tight", isNetGrowth ? "text-slate-900" : "text-rose-600")}>
            {isNetGrowth ? '+' : ''}
            {Math.round(netGrowth)}%
          </h3>
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 border", isNetGrowth ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100")}>
            {isNetGrowth ? 'Growth' : 'Decline'}
          </span>
        </div>
      </div>

      {/* Monthly Expenses Card */}
      <div className="bg-white border border-slate-100 rounded-xl p-6">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
          Operating Expenses
        </p>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5 tabular-nums">
          <FaNairaSign className="text-sm opacity-40" />
          {new Intl.NumberFormat().format(stats.totalExpenses || 0)}
        </h2>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-slate-900 rounded-xl p-6 text-white">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
          Total Revenue
        </p>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-1.5 tabular-nums">
          <FaNairaSign className="text-sm opacity-60" />
          {new Intl.NumberFormat().format(stats.totalRevenue)}
        </h2>
      </div>

      {/* Guest Velocity Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-100">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
          Guest Volume
        </p>
        <div className="flex items-end gap-2">
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
            {stats.totalCustomers}
          </h3>
          <span className="text-[10px] font-bold text-slate-400 mb-1">
            Check-ins
          </span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyScoreboard;
