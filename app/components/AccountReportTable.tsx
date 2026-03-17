'use client';
import { ReactNode, useMemo, useState } from 'react';
import { Ban, Activity } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import moment from 'moment';

import AccountReportActions from '../admin/components/AccountReportActions';
import MonthlyScoreboard from './account-report/MonthlyScoreboard';
import ShiftActivityPulse from './account-report/ShiftActivityPulse';
import ReportCardHeader from './account-report/ReportCardHeader';
import GuestLogTable from './account-report/GuestLogTable';
import EntryDetailPanel from './account-report/EntryDetailPanel';
import {
  calculateStats,
  calculateTotalCashSales,
  objectToArrObj,
  getInsights,
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
    <section className="relative w-full space-y-12">
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          body {
            background: white !important;
          }
          section {
            space-y: 0 !important;
          }
          .rounded-\\[2\\.5rem\\] {
            rounded: 0 !important;
            border: none !important;
            shadow: none !important;
          }
          .shadow-xl,
          .shadow-2xl {
            box-shadow: none !important;
          }
          .bg-slate-50\\/50,
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

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-8 gap-6 print:pb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
            <Activity className="w-3 h-3" />
            Performance Audit
          </div>
          <h1 className="text-4xl capitalize font-black text-slate-800 tracking-tight">
            {name}'s <span className="text-primary">Report</span>
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

      {/* Monthly Scoreboard */}
      <MonthlyScoreboard stats={monthlyStats} prevStats={prevMonthStats} />

      {/* Per-Report Cards */}
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
              {/* Pulse Visualizer */}
              <div className="px-4 sm:px-12 bg-slate-50/30">
                <ShiftActivityPulse customers={report.customers} />
              </div>

              {/* Report Header */}
              <ReportCardHeader
                report={report}
                type={type}
                insights={insights}
              />

              {/* Report Body */}
              <div className="p-4 sm:p-8 space-y-6 sm:space-y-10">
                <div className="flex flex-col lg:flex-row gap-8">
                  <GuestLogTable customers={report.customers} type={type} />
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
