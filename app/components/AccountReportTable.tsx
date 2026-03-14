'use client';
import { ReactNode, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import moment from 'moment';
import { FaNairaSign } from 'react-icons/fa6';
import { formatAmount } from '../utils/formatAmount';
import { cn } from '../lib/utils';
import ApproveAccountReport from '../admin/components/ApproveAccountReport';
import Expenses from '../portal/components/Expenses';
import DrinkSales from '../portal/components/DrinkSales';
import AccountReportActions from '../admin/components/AccountReportActions';
import EditCustomer from '../portal/EditCustomer';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  CreditCard,
  Wallet,
  Phone,
  Clock,
  CheckCircle2,
  Receipt,
  Ban,
  Activity,
  Zap,
  Users,
  TrendingUp,
  Fingerprint,
  BarChart3,
  Award,
  Gem,
  TrendingDown,
} from 'lucide-react';

function getInsights(customers: any[], stats: any) {
  const insights = [];
  const total = stats.pos + stats.cash;
  if (total === 0) return [];

  const posRate = (stats.pos / total) * 100;
  const cashRate = (stats.cash / total) * 100;
  const shortRestCount = customers.filter(
    (c) => c.stayType === 'SHORT-REST',
  ).length;
  const shortRestRate = (shortRestCount / customers.length) * 100;

  if (customers.length > 8) {
    insights.push({
      label: 'High Volume',
      icon: <Users size={10} />,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    });
  }
  if (posRate > 70) {
    insights.push({
      label: 'POS Performance',
      icon: <CreditCard size={10} />,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    });
  }
  if (cashRate > 70) {
    insights.push({
      label: 'Cash Intensive',
      icon: <Wallet size={10} />,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    });
  }
  if (shortRestRate > 50) {
    insights.push({
      label: 'Rapid Turnover',
      icon: <Zap size={10} />,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    });
  }
  if (total > 150000) {
    insights.push({
      label: 'Premium Shift',
      icon: <TrendingUp size={10} />,
      color: 'bg-primary/10 text-primary border-primary/20',
    });
  }

  // New Efficiency Badges
  if (total > 250000 && customers.length > 12) {
    insights.push({
      label: 'Elite Host',
      icon: <Gem size={10} />,
      color:
        'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-transparent shadow-lg shadow-violet-500/20',
    });
  } else if (total > 200000) {
    insights.push({
      label: 'Gold Performer',
      icon: <Award size={10} />,
      color: 'bg-amber-400 text-amber-950 border-amber-500/20',
    });
  }

  return insights;
}

const RevenueTrendChart = ({ reports }: { reports: any[] }) => {
  const points = reports
    .slice(-10)
    .reverse()
    .map((r) => {
      const s =
        r.lodgeAmount.reduce(
          (acc: number, curr: any) => acc + (curr._sum.amount || 0),
          0,
        ) +
        ((r.drinkSales?.pos || 0) + (r.drinkSales?.cash || 0));
      return s;
    });

  const max = Math.max(...points, 1);
  const path = points
    .map(
      (p, i) =>
        `${(i / Math.max(1, points.length - 1)) * 100},${100 - (p / max) * 80}`,
    )
    .join(' L ');

  return (
    <div className="h-full w-full bg-slate-50/50 rounded-2xl p-6 border border-slate-100 relative group overflow-hidden flex flex-col justify-between">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
          <TrendingUp size={10} className="text-primary" />
          Revenue Velocity
        </span>
        <span className="text-[8px] font-bold text-slate-300">
          Last 10 Shifts
        </span>
      </div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-32 overflow-visible"
      >
        <path
          d={`M 0,100 L 0,${100 - (points[0] / max) * 80} L ${path} L 100,100 Z`}
          className="fill-primary/5"
        />
        <path
          d={`M 0,${100 - (points[0] / max) * 80} L ${path}`}
          className="stroke-primary stroke-[3px] fill-none transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40" />
    </div>
  );
};

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
      {/* Executive Net Performance Card */}
      <div
        className={cn(
          'rounded-[2rem] p-8 relative overflow-hidden group shadow-xl transition-all duration-500',
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
      <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 relative overflow-hidden group shadow-xl shadow-slate-200/30">
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

      <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <BarChart3 size={60} />
        </div>
        <div className="relative z-10">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Total Revenue
          </p>
          <h2 className="text-3xl font-black tracking-tighter flex items-center gap-2 tabular-nums">
            <FaNairaSign className="text-sm text-primary" />
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

      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between group relative overflow-hidden">
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

      <div className="flex flex-col h-full">
        <RevenueTrendChart reports={stats.allReports} />
      </div>
    </div>
  );
};

const ShiftActivityPulse = ({ customers }: { customers: any[] }) => {
  return (
    <div className="w-full flex items-center gap-1.5 px-1 py-3 group">
      <div className="h-1.5 w-1.5 rounded-full bg-primary/30 animate-pulse group-hover:bg-primary transition-colors" />
      <div className="flex-1 h-[1px] rounded-full bg-slate-100 relative overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        {customers.map((_, i) => (
          <div
            key={i}
            className="absolute h-3 w-[1px] bg-primary/40 blur-[0.5px] group-hover:bg-primary group-hover:h-5 transition-all duration-500"
            style={{
              left: `${(i / Math.max(1, customers.length - 1)) * 96 + 2}%`,
              opacity: 0.2 + (i / customers.length) * 0.8,
            }}
          />
        ))}
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-primary/30 animate-pulse group-hover:bg-primary transition-colors" />
    </div>
  );
};

export default function AccountReportTable({
  children,
  type,
  accountReport,
  name,
  prevAccountReport = [],
}: {
  children?: ReactNode;
  type?: string;
  name: string;
  accountReport: any;
  prevAccountReport?: any;
}) {
  const [currAccountReport, setCurrAccountReport] = useState(accountReport);
  const searchParams = useSearchParams();
  const selectedMonth = moment()
    .month(+(searchParams.get('month') || moment().month() + 1) - 1)
    .format('MMMM');

  const calculateStats = (reports: any[]) => {
    let totalLodgePos = 0;
    let totalLodgeCash = 0;
    let totalDrinkPos = 0;
    let totalDrinkCash = 0;
    let totalExpenses = 0;
    let totalCustomers = 0;
    const customerMap = new Map<string, { count: number; name: string }>();

    reports.forEach((report: any) => {
      const lodgePos = report.lodgeAmount.reduce(
        (acc: number, s: any) =>
          s.paymentType === 'POS' ? acc + (s._sum.amount || 0) : acc,
        0,
      );
      const lodgeCash = report.lodgeAmount.reduce(
        (acc: number, s: any) =>
          s.paymentType === 'CASH' ? acc + (s._sum.amount || 0) : acc,
        0,
      );
      const drinkPos = report.drinkSales?.pos || 0;
      const drinkCash = report.drinkSales?.cash || 0;

      // Extract and sum expenses
      const reportExpenses =
        report.expenses?.reduce(
          (acc: number, e: any) => acc + (Number(e.amount) || 0),
          0,
        ) || 0;

      totalLodgePos += lodgePos;
      totalLodgeCash += lodgeCash;
      totalDrinkPos += drinkPos;
      totalDrinkCash += drinkCash;
      totalExpenses += reportExpenses;
      totalCustomers += report.customers.length;

      // Track loyalty
      report.customers.forEach((c: any) => {
        const phone = c.phoneNumber?.toString().replace(/\s+/g, '');
        if (!phone) return;
        const current = customerMap.get(phone) || { count: 0, name: c.name };
        customerMap.set(phone, { count: current.count + 1, name: c.name });
      });
    });

    let topCustomer = null;
    let maxVisits = 0;

    for (const [_, data] of customerMap.entries()) {
      if (data.count > maxVisits) {
        maxVisits = data.count;
        topCustomer = data.name;
      }
    }

    const totalRevenue =
      totalLodgePos + totalLodgeCash + totalDrinkPos + totalDrinkCash;

    return {
      totalLodgePos,
      totalLodgeCash,
      totalDrinkPos,
      totalDrinkCash,
      totalPos: totalLodgePos + totalDrinkPos,
      totalCash: totalLodgeCash + totalDrinkCash,
      totalRevenue,
      totalExpenses,
      netRevenue: totalRevenue - totalExpenses,
      totalCustomers,
      reportCount: reports.length || 1,
      allReports: reports,
      mvp: maxVisits > 1 ? { name: topCustomer, count: maxVisits } : null,
    };
  };

  const monthlyStats = useMemo(
    () => calculateStats(currAccountReport),
    [currAccountReport],
  );
  const prevMonthStats = useMemo(
    () => calculateStats(prevAccountReport),
    [prevAccountReport],
  );

  interface LodgeSale {
    paymentType: 'CASH' | 'POS';
    _sum: {
      amount: number;
    };
  }

  interface DrinkSales {
    cash?: number;
    pos?: number;
  }

  function calculateTotalCashSales(
    lodgeSales: LodgeSale[],
    drinkSales: DrinkSales,
  ): {
    lodgePos: number;
    lodgeCash: number;
    drinkPos: number;
    drinkCash: number;
  } {
    const lodgeCash = lodgeSales.reduce(
      (acc, s) => (s.paymentType === 'CASH' ? acc + (s._sum.amount || 0) : acc),
      0,
    );
    const lodgePos = lodgeSales.reduce(
      (acc, s) => (s.paymentType === 'POS' ? acc + (s._sum.amount || 0) : acc),
      0,
    );
    const drinkCash = drinkSales?.cash || 0;
    const drinkPos = drinkSales?.pos || 0;

    return {
      lodgePos,
      lodgeCash,
      drinkPos,
      drinkCash,
    };
  }

  function objectToArrObj(obj: any) {
    if (!obj) return [];
    return Object.entries(obj)
      .map(([key, value]) => ({ amount: value as number, method: key }))
      .filter((res) => res.amount > 0);
  }

  useMemo(() => {
    setCurrAccountReport(accountReport);
  }, [accountReport]);

  if (accountReport.length <= 0)
    return (
      <section className="px-6 w-full">
        <AccountReportActions
          name={name}
          currAccountReport={currAccountReport}
          setCurrAccountReport={setCurrAccountReport}
        />
        <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
          <div className="bg-slate-100 p-6 rounded-full text-slate-400">
            <Ban size={48} />
          </div>
          <h1 className="text-3xl font-black text-slate-700 max-sm:text-xl text-center">
            No report for{' '}
            <span className="text-primary capitalize">{name}</span>
            <br />
            <span className="text-lg font-bold text-slate-400">
              ({selectedMonth}, {searchParams.get('year')})
            </span>
          </h1>
        </div>
      </section>
    );

  return (
    <section className="relative w-full space-y-12">
      <style jsx global>{`
        @media print {
          .print\:hidden {
            display: none !important;
          }
          body {
            background: white !important;
          }
          section {
            space-y: 0 !important;
          }
          .rounded-\[2\.5rem\] {
            rounded: 0 !important;
            border: none !important;
            shadow: none !important;
          }
          .shadow-xl,
          .shadow-2xl {
            box-shadow: none !important;
          }
          .bg-slate-50\/50,
          .bg-slate-50 {
            background: transparent !important;
            border-bottom: 1px solid #eee !important;
          }
          .p-8 {
            padding: 1rem !important;
          }
          h1 {
            font-size: 24pt !important;
          }
          h3 {
            font-size: 14pt !important;
          }
          .grid {
            display: block !important;
          }
          .gap-12,
          .gap-10,
          .gap-6 {
            gap: 0 !important;
          }
          .mb-10,
          .my-10,
          .space-y-10 {
            margin: 0 !important;
          }
          .border {
            border: 1px solid #eee !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th,
          td {
            border: 1px solid #eee !important;
            padding: 4pt !important;
            font-size: 9pt !important;
          }
          .transition-all {
            transition: none !important;
          }
          .bg-emerald-50,
          .bg-blue-50,
          .bg-amber-50,
          .bg-rose-50 {
            background: #f9f9f9 !important;
            border: 1px solid #ddd !important;
          }
          .text-emerald-600,
          .text-blue-600,
          .text-amber-600,
          .text-rose-600 {
            color: black !important;
          }
        }
      `}</style>

      {children}

      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-8 gap-6 print:pb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
            <Activity className="w-3 h-3" />
            Performance Audit
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            {name}'s <span className="text-primary">Journal</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Summary for {selectedMonth} {searchParams.get('year')}
          </p>
        </div>

        <AccountReportActions
          name={name}
          currAccountReport={currAccountReport}
          setCurrAccountReport={setCurrAccountReport}
        />
      </div>

      {/* Modern Executive Scoreboard */}
      <MonthlyScoreboard stats={monthlyStats} prevStats={prevMonthStats} />

      <div className="grid grid-cols-1 gap-12 print:gap-4">
        {currAccountReport.map((report: any) => {
          const stats = calculateTotalCashSales(
            report.lodgeAmount,
            report.drinkSales,
          );
          const insights = getInsights(report.customers, stats);

          return (
            <div
              key={report.id}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden transition-all hover:shadow-2xl hover:shadow-slate-200/60"
            >
              {/* Pulse Visualizer at very top */}
              <div className="px-12 bg-slate-50/30">
                <ShiftActivityPulse customers={report.customers} />
              </div>

              {/* Report Header */}
              <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm text-primary">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">
                      {moment(report.checkInTime).format('dddd, MMMM Do YYYY')}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      {type !== 'worker' && (
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={10} className="text-primary" />
                          {moment(report.checkInTime).format('h:mm A')}
                        </p>
                      )}

                      {/* Insight Pills */}
                      <div className="flex items-center gap-2">
                        {insights.map((insight, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              'flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase border tracking-wider',
                              insight.color,
                            )}
                          >
                            {insight.icon}
                            {insight.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {type === 'worker' ? (
                    <div
                      className={cn(
                        'relative group cursor-default transition-all duration-500',
                        report.approved ? 'hover:scale-105' : 'hover:rotate-1',
                      )}
                    >
                      <div
                        className={cn(
                          'absolute -inset-1 blur opacity-25 rounded-full transition duration-500 group-hover:opacity-50',
                          report.approved ? 'bg-emerald-400' : 'bg-amber-400',
                        )}
                      />
                      <div
                        className={cn(
                          'relative flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl border shadow-2xl transition-all duration-500',
                          report.approved
                            ? 'bg-white/80 text-emerald-600 border-emerald-200/50 shadow-emerald-500/10'
                            : 'bg-white/80 text-amber-600 border-amber-200/50 shadow-amber-500/10',
                        )}
                      >
                        {report.approved ? (
                          <Fingerprint size={12} className="animate-pulse" />
                        ) : (
                          <Activity size={12} className="animate-pulse" />
                        )}
                        <span>
                          {report.approved
                            ? 'System Certified'
                            : 'Pending Audit'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <ApproveAccountReport
                      id={report.id}
                      approved={report.approved}
                    />
                  )}
                </div>
              </div>

              <div className="p-8 space-y-10">
                {/* Stats Breakdown Section */}
                <div className="space-y-6">
                  {/* Category Headers */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Accommodation Category */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                        <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                          Accommodation Revenue
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-indigo-50/30 rounded-3xl p-6 border border-indigo-100/50 group hover:bg-white transition-all shadow-sm">
                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <CreditCard size={10} /> Lodge POS
                          </p>
                          <p className="text-xl font-black text-indigo-900 tabular-nums flex items-center gap-1">
                            <FaNairaSign className="text-sm opacity-60" />
                            {formatAmount(stats.lodgePos)}
                          </p>
                        </div>
                        <div className="bg-indigo-50/30 rounded-3xl p-6 border border-indigo-100/50 group hover:bg-white transition-all shadow-sm">
                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Wallet size={10} /> Lodge Cash
                          </p>
                          <p className="text-xl font-black text-indigo-900 tabular-nums flex items-center gap-1">
                            <FaNairaSign className="text-sm opacity-60" />
                            {formatAmount(stats.lodgeCash)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Liquor Category */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-amber-500 rounded-full" />
                        <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                          Liquor Sales
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-amber-50/30 rounded-3xl p-6 border border-amber-100/50 group hover:bg-white transition-all shadow-sm">
                          <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <CreditCard size={10} /> Drink POS
                          </p>
                          <p className="text-xl font-black text-amber-900 tabular-nums flex items-center gap-1">
                            <FaNairaSign className="text-sm opacity-60" />
                            {formatAmount(stats.drinkPos)}
                          </p>
                        </div>
                        <div className="bg-amber-50/30 rounded-3xl p-6 border border-amber-100/50 group hover:bg-white transition-all shadow-sm">
                          <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Wallet size={10} /> Drink Cash
                          </p>
                          <p className="text-xl font-black text-amber-900 tabular-nums flex items-center gap-1">
                            <FaNairaSign className="text-sm opacity-60" />
                            {formatAmount(stats.drinkCash)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Summary Bar */}
                  <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between shadow-2xl shadow-slate-900/20 relative overflow-hidden group gap-6">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                      <Receipt size={140} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                        Net Session Sales
                      </p>
                      <h2 className="text-4xl font-black text-white flex items-center gap-2 tabular-nums">
                        <FaNairaSign className="text-2xl text-primary-foreground/90 font-bold" />
                        {formatAmount(
                          stats.lodgePos +
                            stats.lodgeCash +
                            stats.drinkPos +
                            stats.drinkCash,
                        )}
                      </h2>
                    </div>
                    <div className="flex gap-4 relative z-10 w-full sm:w-auto">
                      <div className="flex-1 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
                          Total POS
                        </p>
                        <p className="text-lg font-black text-blue-400 tabular-nums flex items-center gap-1">
                          <FaNairaSign size={10} />{' '}
                          {formatAmount(stats.lodgePos + stats.drinkPos)}
                        </p>
                      </div>
                      <div className="flex-1 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
                          Total Cash
                        </p>
                        <p className="text-lg font-black text-emerald-400 tabular-nums flex items-center gap-1">
                          <FaNairaSign size={10} />{' '}
                          {formatAmount(stats.lodgeCash + stats.drinkCash)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-Actions & Details */}
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-0.5 w-6 bg-primary rounded-full" />
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                        Guest Log
                      </h4>
                    </div>
                    <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="text-[10px] font-black uppercase text-slate-500">
                              Guest
                            </TableHead>
                            <TableHead className="text-[10px] font-black uppercase text-slate-500">
                              Contact
                            </TableHead>
                            <TableHead className="text-[10px] font-black uppercase text-slate-500 text-center">
                              Room
                            </TableHead>
                            <TableHead className="text-[10px] font-black uppercase text-slate-500">
                              Payment
                            </TableHead>
                            <TableHead className="text-[10px] font-black uppercase text-slate-500 text-right">
                              Amount
                            </TableHead>
                            <TableHead className="text-[10px] font-black uppercase text-slate-500 text-right opacity-0">
                              -
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-50">
                          {report.customers.map((customer: any) => (
                            <TableRow
                              key={customer.id}
                              className="hover:bg-slate-50/50 transition-colors border-none"
                            >
                              <TableCell className="font-bold text-slate-800">
                                {customer.name}
                              </TableCell>
                              <TableCell className="text-xs text-slate-500 font-medium">
                                <div className="flex items-center gap-2">
                                  <Phone
                                    size={10}
                                    className="text-primary/40"
                                  />
                                  {customer.phoneNumber}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-black">
                                  {customer.room}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <span
                                    className={cn(
                                      'text-[9px] font-black px-1.5 py-0.5 rounded-md w-fit uppercase border',
                                      customer.paymentType === 'CASH'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        : 'bg-blue-50 text-blue-600 border-blue-100',
                                    )}
                                  >
                                    {customer.paymentType}
                                  </span>
                                  <span className="text-[8px] font-bold text-slate-400 pl-0.5 uppercase tracking-tighter italic">
                                    {customer.stayType}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-black text-slate-800 tabular-nums">
                                <div className="flex items-center justify-end gap-0.5">
                                  <FaNairaSign
                                    size={10}
                                    className="text-primary"
                                  />
                                  {formatAmount(customer.amount)}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {type === 'worker' && !customer.edit && (
                                  <EditCustomer
                                    id={customer.id}
                                    workerId={customer.workerId}
                                    room={customer.room as unknown as number}
                                    amount={
                                      customer.amount as unknown as string
                                    }
                                    stay={customer.stayType}
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Right Side - Actions & Specific Totals */}
                  <div className="lg:w-80 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-0.5 w-6 bg-primary rounded-full" />
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                        Entry Detail
                      </h4>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                      {/* Action Buttons Rendered within this section */}
                      <div className="flex flex-col gap-3 pb-6 border-b border-slate-100">
                        {type === 'worker' && (
                          <>
                            <Expenses
                              savedExpenses={report.expenses}
                              workerId={report.id}
                            />
                            {!report.drinkSales?.pos &&
                              !report.drinkSales?.cash && (
                                <DrinkSales
                                  savedDrinkSales={report.drinkSales}
                                  workerId={report.id}
                                />
                              )}
                          </>
                        )}
                      </div>

                      {/* Mini Ledger */}
                      <div className="space-y-4">
                        {report.expenses.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-3">
                              Expenses Record
                            </p>
                            <div className="space-y-2">
                              {report.expenses.map((expense: any) => (
                                <div
                                  key={crypto.randomUUID()}
                                  className="flex justify-between items-center bg-rose-50/30 p-2 rounded-xl border border-rose-50"
                                >
                                  <span className="text-xs font-bold text-slate-600 truncate max-w-[120px]">
                                    {expense.expense}
                                  </span>
                                  <span className="text-xs font-black text-rose-600 flex items-center">
                                    - <FaNairaSign size={8} />{' '}
                                    {new Intl.NumberFormat().format(
                                      expense.amount,
                                    )}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {objectToArrObj(report.drinkSales).length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-3">
                              Liquor Ledger
                            </p>
                            <div className="space-y-2">
                              {objectToArrObj(report.drinkSales).map(
                                (sales) => (
                                  <div
                                    key={sales.method}
                                    className="flex justify-between items-center bg-amber-50/30 p-2 rounded-xl border border-amber-50"
                                  >
                                    <span className="text-xs font-bold text-slate-600">
                                      Sales ({sales.method})
                                    </span>
                                    <span className="text-xs font-black text-amber-600 flex items-center">
                                      + <FaNairaSign size={8} />{' '}
                                      {new Intl.NumberFormat().format(
                                        sales.amount,
                                      )}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Final Audit Stamp */}
                      <div className="pt-2">
                        <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/40 relative overflow-hidden group">
                          <div className="absolute -right-6 -top-6 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                            <CheckCircle2 size={120} />
                          </div>

                          <div className="relative z-10 space-y-6">
                            <div>
                              <p className="text-primary-foreground/60 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                                Final Approved Totals
                              </p>
                              <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-tighter italic">
                                Account Audit Statement
                              </h3>
                            </div>

                            <div className="space-y-4">
                              <div className="flex flex-col gap-1 p-4 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">
                                  POS Remittance
                                </p>
                                <p className="text-3xl font-black flex items-center gap-1.5 tabular-nums">
                                  <FaNairaSign className="text-base opacity-90" />
                                  {formatAmount(
                                    report.approvedAmount?.totalPos || 0,
                                  )}
                                </p>
                              </div>

                              <div className="flex flex-col gap-1 p-4 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">
                                  Cash Handover
                                </p>
                                <p className="text-3xl font-black flex items-center gap-1.5 tabular-nums">
                                  <FaNairaSign className="text-base opacity-90" />
                                  {formatAmount(
                                    report.approvedAmount?.totalCash || 0,
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="pt-2 flex items-center gap-2 opacity-60">
                              <div className="h-px flex-1 bg-white/20" />
                              <span className="text-[8px] font-black uppercase tracking-widest">
                                Verified Signature
                              </span>
                              <div className="h-px flex-1 bg-white/20" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
