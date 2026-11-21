'use client';
import { ReactNode, useMemo, useState } from 'react';
import moment from 'moment';
import { Ban, CalendarOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import AccountReportActions from '../admin/components/AccountReportActions';
import MonthlyScoreboard from './account-report/MonthlyScoreboard';
import ReportCardHeader from './account-report/ReportCardHeader';
import RevenueBreakdown from './account-report/RevenueBreakdown';
import GuestLogTable from './account-report/GuestLogTable';
import EntryDetailPanel from './account-report/EntryDetailPanel';
import {
  calculateStats,
  calculateTotalCashSales,
  getInsights,
} from './account-report/accountReportUtils';

export default function AccountReportTable({
  children,
  type,
  accountReport,
  name,
  prevAccountReport = [],
  emptyDays = [],
}: {
  children?: ReactNode;
  type?: string;
  name: string;
  accountReport: any;
  prevAccountReport?: any;
  emptyDays?: string[];
}) {
  const [currAccountReport, setCurrAccountReport] = useState(accountReport);
  const searchParams = useSearchParams();
  const selectedMonth = moment()
    .month(+(searchParams.get('month') || moment().month() + 1) - 1)
    .format('MMMM');

  const monthlyStats = useMemo(
    () => calculateStats(currAccountReport),
    [currAccountReport],
  );
  const prevMonthStats = useMemo(
    () => calculateStats(prevAccountReport),
    [prevAccountReport],
  );

  useMemo(() => {
    setCurrAccountReport(accountReport);
  }, [accountReport]);

  // Shifts and empty days together, newest first
  const timeline = useMemo(() => {
    const shifts = currAccountReport.map((report: any) => ({
      day: moment(report.checkInTime).format('YYYY-MM-DD'),
      report,
    }));
    const gaps = emptyDays.map((day) => ({ day, report: null }));
    return [...shifts, ...gaps].sort((a: any, b: any) =>
      a.day < b.day ? 1 : -1,
    );
  }, [currAccountReport, emptyDays]);

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
    <section className="relative w-full space-y-8">
      {children}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-8 gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight capitalize">
            {name}'s <span className="text-slate-500 font-medium">Journal</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            {selectedMonth} {searchParams.get('year')} • Performance Summary
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

      <div className="grid grid-cols-1 gap-8">
        {timeline.map(({ day, report }: any) => {
          if (!report)
            return (
              <div
                key={day}
                className="bg-white rounded-xl border border-dashed border-slate-200 px-6 py-6 flex items-center gap-4"
              >
                <div className="bg-slate-50 p-2.5 rounded-lg text-slate-300 border border-slate-100">
                  <CalendarOff size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-500 tracking-tight">
                    No shift on {moment(day).format('dddd, MMMM Do YYYY')}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    Nobody was logged in that day. Please confirm with your
                    workers.
                  </p>
                </div>
              </div>
            );

          const stats = calculateTotalCashSales(
            report.lodgeAmount,
            report.drinkSales,
          );
          const insights = getInsights(report.customers, stats);

          return (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden"
            >
              {/* Report Header */}
              <ReportCardHeader
                report={report}
                type={type}
                insights={insights}
              />

              <div className="p-4 sm:p-8 space-y-8">
                <RevenueBreakdown stats={stats} />

                <div className="flex flex-col lg:flex-row gap-8">
                  <GuestLogTable customers={report.customers} type={type} />

                  <EntryDetailPanel report={report} type={type} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
