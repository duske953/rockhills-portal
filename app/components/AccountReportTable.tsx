'use client';
import { ReactNode, useMemo, useState } from 'react';
import moment from 'moment';
import { Ban, Activity } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import AccountReportActions from '../admin/components/AccountReportActions';
import MonthlyScoreboard from './account-report/MonthlyScoreboard';
import ReportCardHeader from './account-report/ReportCardHeader';
import ShiftActivityPulse from './account-report/ShiftActivityPulse';
import RevenueBreakdown from './account-report/RevenueBreakdown';
import GuestLogTable from './account-report/GuestLogTable';
import EntryDetailPanel from './account-report/EntryDetailPanel';
import {
  calculateStats,
  calculateTotalCashSales,
  getInsights,
  objectToArrObj,
} from './account-report/accountReportUtils';

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
        {currAccountReport.map((report: any) => {
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
                {/* Stats Breakdown Section */}
                <RevenueBreakdown stats={stats} />

                {/* Sub-Actions & Details */}
                <div className="flex flex-col lg:flex-row gap-8">
                  <GuestLogTable customers={report.customers} type={type} />

                  {/* Right Side - Actions & Specific Totals */}
                  <EntryDetailPanel
                    report={report}
                    type={type}
                    objectToArrObj={objectToArrObj}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
