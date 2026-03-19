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

  const expenseChange =
    prevStats.totalExpenses && prevStats.totalExpenses !== 0
      ? ((stats.totalExpenses - prevStats.totalExpenses) /
          Math.abs(prevStats.totalExpenses)) *
        100
      : 0;

  const isNetGrowth = netGrowth >= 0;
  const isExpenseUp = stats.totalExpenses > prevStats.totalExpenses;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 print:hidden">
      {/* Executive Net Performance Card */}
      <div
        className={cn(
          'rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 relative overflow-hidden group shadow-xl transition-all duration-500',
          isNetGrowth
            ? 'bg-emerald-50 border border-emerald-100 shadow-emerald-200/50'
            : 'bg-rose-50 border border-rose-100 shadow-rose-200/50',
        )}
      >
        <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
          {isNetGrowth ? <TrendingUp size={80} /> : <TrendingDown size={80} />}
        </div>
        <div className="relative z-10">
          <p
            className={cn(
              'text-[10px] font-black uppercase tracking-[0.2em] mb-4',
              isNetGrowth ? 'text-emerald-500' : 'text-rose-500',
            )}
          >
            Executive Metrics
          </p>
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                'text-4xl font-black tabular-nums',
                isNetGrowth ? 'text-emerald-700' : 'text-rose-700',
              )}
            >
              {isNetGrowth ? '+' : ''}
              {Math.round(netGrowth)}%
            </h3>
            <span
              className={cn(
                'px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase',
                isNetGrowth
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-500 text-white',
              )}
            >
              Net Performance
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-500 mt-4 leading-relaxed">
            {isExpenseUp && isNetGrowth
              ? `Operational costs (Fuel/Fueling) rose by ${Math.round(expenseChange)}%, but strong session revenue offset the spike.`
              : isExpenseUp && !isNetGrowth
                ? `High operational expenses (rising by ${Math.round(expenseChange)}%) are significantly reducing your net profit this month.`
                : isNetGrowth
                  ? `Your net retention is healthy, driven by efficient operational cost management.`
                  : `Net performance has dipped slightly due to a shift in session volume.`}
          </p>
        </div>
      </div>

      {/* Monthly Expenses Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 relative overflow-hidden group shadow-xl shadow-slate-200/30">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Receipt size={60} />
        </div>
        <div className="relative z-10">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Operational Expenses
          </p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-2 tabular-nums">
            <FaNairaSign className="text-sm opacity-60" />
            {new Intl.NumberFormat().format(stats.totalExpenses || 0)}
          </h2>
          <div className="flex items-center gap-2 mt-6">
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black',
                isExpenseUp
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700',
              )}
            >
              <Activity size={10} />
              {isExpenseUp ? 'Expenses Rising' : 'Expenses Optimized'}
            </div>
          </div>
        </div>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-slate-900 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <BarChart3 size={60} />
        </div>
        <div className="relative z-10">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Total Revenue
          </p>
          <h2 className="text-3xl font-black tracking-tighter flex items-center gap-2 tabular-nums">
            <FaNairaSign className="text-sm text-white" />
            {new Intl.NumberFormat().format(stats.totalRevenue)}
          </h2>
          <div className="flex gap-2 mt-6">
            <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">
                POS
              </p>
              <p className="text-[10px] font-black text-blue-400">
                {Math.round((stats.totalPos / stats.totalRevenue) * 100)}%
              </p>
            </div>
            <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">
                Cash
              </p>
              <p className="text-[10px] font-black text-emerald-400">
                {Math.round((stats.totalCash / stats.totalRevenue) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Star Guest / Guest Velocity Card */}
      <div className="bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between group relative overflow-hidden">
        {stats.mvp ? (
          <>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <p className="text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-right">
                Star Guest
              </p>
              <h3 className="text-2xl font-black text-slate-800 leading-tight">
                <span className="text-rose-500">{stats.mvp.name}</span>
                <br />
                is your MVP!
              </h3>
              <p className="text-[10px] font-bold text-slate-400 mt-2">
                Visited {stats.mvp.count} times this month
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3 bg-rose-50 p-3 rounded-2xl border border-rose-100/50">
              <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200">
                <Gem size={14} />
              </div>
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-tighter">
                Most Frequent Patron
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-right">
                Guest Velocity
              </p>
              <div className="flex justify-end gap-1 items-end">
                <span className="text-4xl font-black text-slate-800 tabular-nums">
                  {stats.totalCustomers}
                </span>
                <span className="text-xs font-bold text-slate-400 mb-1.5 px-2 bg-slate-50 rounded-lg">
                  Check-ins
                </span>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400"
                  >
                    <Users size={12} />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-bold text-slate-500 leading-tight">
                Average {Math.round(stats.totalCustomers / stats.reportCount)}{' '}
                guests <br />
                per session
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MonthlyScoreboard;
