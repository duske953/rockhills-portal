'use client';

import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  ChevronRight,
  UserCheck,
  Wine,
  Receipt,
  Wallet,
  Zap,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Banknote
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

interface DashboardProps {
  data: {
    trendData: any[];
    stayTypeData: any[];
    paymentMethodData: any[];
    performanceData: any[];
    roomData: any[];
    workerDays: { name: string; days: number }[];
    peakDay: { day: string; amount: number };
    totalLodgeRevenue: number;
    totalDrinkRevenue: number;
    totalExpenses: number;
    netRevenue: number;
    totalGuests: number;
    occupancyRate: number;
    avgDailyRevenue: number;
    workers: { name: string }[];
    selectedWorker?: string;
    isCurrWorkerApproved: boolean;
    selectedWorkerData: {
      name: string;
      lodgeRevenue: number;
      drinkRevenue: number;
      expenses: number;
      netRevenue: number;
      guests: number;
      daysWorked: number;
      approved: boolean;
    };
  };
  month: string;
  year: string;
}

export default function AnalyticsDashboard({
  data,
  month,
  year,
}: DashboardProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);

  // Identify the best worker (highest revenue)
  const bestWorker = useMemo(() => {
    if (!data.performanceData || data.performanceData.length === 0) return null;
    return data.performanceData[0];
  }, [data.performanceData]);

  // Identify most booked room
  const mostBookedRoom = useMemo(() => {
    if (!data.roomData || data.roomData.length === 0) return null;
    return [...data.roomData].sort((a, b) => b.bookings - a.bookings)[0];
  }, [data.roomData]);

  const isBestWorker =
    data.selectedWorker &&
    bestWorker &&
    data.selectedWorker.toLowerCase() === bestWorker.name.toLowerCase();

  // Payment method specific stats
  const cashTotal =
    data.paymentMethodData.find((p) => p.name.toLowerCase() === 'cash')
      ?.value || 0;
  const posTotal =
    data.paymentMethodData.find((p) => p.name.toLowerCase() === 'pos')?.value ||
    0;
  const transferTotal =
    data.paymentMethodData.find((p) => p.name.toLowerCase() === 'transfer')
      ?.value || 0;

  // Generate Takeaway Message
  const takeaway = useMemo(() => {
    const insights = [];

    // Performance Insight
    if (data.occupancyRate > 70) {
      insights.push(
        `Exceptional room demand this month! With a ${data.occupancyRate.toFixed(1)}% occupancy rate, RockHills is performing at peak capacity.`,
      );
    } else if (data.occupancyRate < 30) {
      insights.push(
        `Occupancy is lower than usual (${data.occupancyRate.toFixed(1)}%). It might be worth exploring mid-week promotions to drive traffic.`,
      );
    }

    // Room Insight
    if (mostBookedRoom) {
      insights.push(
        `${mostBookedRoom.room} is your clear flagship asset, generating ${formatCurrency(mostBookedRoom.revenue)} alone. Consider prioritizing its maintenance.`,
      );
    }

    // Worker Insight
    if (bestWorker) {
      insights.push(
        `${bestWorker.name} has shown outstanding output, contributing ${formatCurrency(bestWorker.value)} to the total revenue. Their shift efficiency is a benchmark for the team.`,
      );
    }

    // Attendance Insight
    if (data.workerDays && data.workerDays.length > 0) {
      const topAttender = [...data.workerDays].sort((a, b) => b.days - a.days)[0];
      if (topAttender.days > 20) {
        insights.push(`${topAttender.name} is the most consistent staff this month, with ${topAttender.days} days worked. Their reliability is crucial for operations.`);
      }
    }

    // Expense Insight
    const expenseRatio =
      (data.totalExpenses / (data.totalLodgeRevenue + data.totalDrinkRevenue)) *
      100;
    if (expenseRatio > 25) {
      insights.push(
        `Operational expenses are currently at ${expenseRatio.toFixed(1)}% of total revenue. A closer audit of shift-based spending might reveal opportunities for cost-saving.`,
      );
    }

    return insights;
  }, [data, mostBookedRoom, bestWorker]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* 3-Column KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <KPICard
            title="Lodge Revenue"
            value={formatCurrency(data.totalLodgeRevenue)}
            icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
            trend="Room bookings"
            color="emerald"
          />
          <KPICard
            title="Drink Revenue"
            value={formatCurrency(data.totalDrinkRevenue)}
            icon={<Wine className="w-5 h-5 text-blue-600" />}
            trend="Bar sales"
            color="blue"
          />
        </div>
        <div className="space-y-6">
          <KPICard
            title="Total Expenses"
            value={formatCurrency(data.totalExpenses)}
            icon={<Receipt className="w-5 h-5 text-rose-600" />}
            trend="Operational costs"
            color="rose"
          />
          <KPICard
            title="Net Revenue"
            value={formatCurrency(data.netRevenue)}
            icon={<Wallet className="w-5 h-5 text-indigo-600" />}
            trend="After expenses"
            color="indigo"
          />
        </div>
        <div className="flex flex-col h-full">
          <Card className="flex-1 rounded-[2.5rem] bg-primary text-white border-none shadow-2xl shadow-primary/20 overflow-hidden relative group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <CardHeader>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-2">
                Engagement Overview
              </p>
              <CardTitle className="text-4xl font-black flex items-center gap-3">
                {data.totalGuests}
                <Users className="w-8 h-8 opacity-40" />
              </CardTitle>
              <p className="text-xs font-bold text-white/80">
                Total registered guests for {month}
              </p>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div>
                  <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-1">
                    Occupancy
                  </p>
                  <p className="text-lg font-black">
                    {data.occupancyRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-1">
                    Avg. Daily
                  </p>
                  <p className="text-lg font-black">
                    {formatCurrency(data.avgDailyRevenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {/* Room ROI Leaderboard */}
          <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden h-full">
            <CardHeader>
              <CardTitle className="text-xl font-black text-slate-800">
                Room ROI <span className="text-primary">Leaderboard</span>
              </CardTitle>
              <CardDescription>Top revenue generating assets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.roomData.slice(0, 5).map((room, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${idx === 0 ? 'bg-amber-100 text-amber-600' : 'bg-white text-slate-400'}`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-black text-slate-800">{room.room}</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase">
                        {room.bookings} Bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-800">
                      {formatCurrency(room.revenue)}
                    </p>
                    <div className="flex items-center justify-end gap-1 text-[10px] font-black text-emerald-500">
                      <ArrowUpRight size={10} />
                      Healthy
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary Message (Replaces Ecosystem) */}
        <Card className="lg:col-span-4 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-indigo-900 text-white border-none shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Banknote size={150} />
          </div>
          <CardHeader>
            <CardTitle className="text-xl font-black">
              Financial <span className="text-indigo-200">Channels</span>
            </CardTitle>
            <CardDescription className="text-indigo-200/60 font-medium italic">
              Cash vs Digital Collection
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center h-[350px] space-y-8 relative z-10">
            <div className="space-y-6">
              <div className="flex items-center gap-5 p-6 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/10 group hover:bg-white/15 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-emerald-400/20 flex items-center justify-center text-emerald-400">
                  <Banknote size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-200/60 uppercase tracking-widest mb-1">
                    Physical Currency
                  </p>
                  <p className="text-lg font-black leading-tight italic">
                    You collected{' '}
                    <span className="text-emerald-400 text-2xl not-italic">
                      {formatCurrency(cashTotal)}
                    </span>{' '}
                    in{' '}
                    <span className="text-emerald-400 underline decoration-2 underline-offset-4">
                      Cash
                    </span>{' '}
                    this month.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-6 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/10 group hover:bg-white/15 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-blue-400/20 flex items-center justify-center text-blue-400">
                  <Smartphone size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-200/60 uppercase tracking-widest mb-1">
                    Digital Settlements
                  </p>
                  <p className="text-lg font-black leading-tight italic">
                    POS & Transfers accounted for{' '}
                    <span className="text-blue-400 text-2xl not-italic">
                      {formatCurrency(posTotal + transferTotal)}
                    </span>{' '}
                    in{' '}
                    <span className="text-blue-400 underline decoration-2 underline-offset-4">
                      Digital Revenue
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-center text-indigo-300 font-black uppercase tracking-[0.2em] pt-4">
              Audit Verified • {month} {year}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workforce Attendance Narrative */}
      {data.workerDays.length > 0 && !data.selectedWorker && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto w-full"
        >
          <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Calendar size={24} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Workforce Pulse</h4>
                <h3 className="text-2xl font-black text-slate-800">Attendance <span className="text-primary">Narrative</span></h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {data.workerDays.map((w, idx) => (
                <div key={idx} className="flex items-start gap-4 group/item">
                   <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors flex-shrink-0" />
                   <p className="text-slate-600 font-medium text-lg italic leading-relaxed">
                     <span className="font-black text-slate-800 capitalize not-italic">{w.name}</span> came to work for <span className="text-primary font-black not-italic">{w.days} days</span> this month.
                   </p>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-12 pt-6 border-t border-slate-50">
               Official Roster Log • {month} {year}
            </p>
          </div>
        </motion.div>
      )}

      {/* Staff Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-12 rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
            <div>
              <CardTitle className="text-xl font-black text-slate-800">
                Staff Audit
              </CardTitle>
              <CardDescription>
                Individual shift performance audit
              </CardDescription>
            </div>
            <WorkerSelectionDropdown
              workers={data.workers}
              currentWorker={data.selectedWorker}
            />
          </CardHeader>
          <CardContent className="pt-8">
            {data.selectedWorker ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="p-10 rounded-[3.5rem] bg-slate-900 text-white space-y-8 relative overflow-hidden border border-slate-800 shadow-2xl">
                  <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-primary backdrop-blur-xl border border-white/10 shadow-2xl">
                          <UserCheck size={48} />
                        </div>
                        {isBestWorker && (
                          <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="absolute -top-4 -right-4 bg-amber-400 text-slate-900 p-3 rounded-full shadow-lg border-2 border-slate-900"
                          >
                            <Award size={24} strokeWidth={3} />
                          </motion.div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                            Personnel Audit
                          </p>
                          {isBestWorker && (
                            <span className="text-[10px] font-black text-slate-900 bg-amber-400 px-3 py-1 rounded-full uppercase tracking-tighter">
                              Best Worker
                            </span>
                          )}
                        </div>
                        <h4 className="text-5xl font-black capitalize tracking-tight">
                          {data.selectedWorker}
                        </h4>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Shift Activity
                        </p>
                        <p className="text-3xl font-black">
                          {data.selectedWorkerData.guests}{' '}
                          <span className="text-sm text-slate-500">Guests</span>
                        </p>
                      </div>
                      {data.selectedWorkerData.approved ? (
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                          <CheckCircle2 size={14} />
                          Verified Audit
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                          <Zap size={14} />
                          Awaiting Review
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
                    <AuditMetric
                      label="Attendance"
                      value={`${data.selectedWorkerData.daysWorked} Days`}
                      icon={<Calendar size={18} />}
                      sub="Total Presence"
                      isHighlight
                    />
                    <AuditMetric
                      label="Lodge Revenue"
                      value={formatCurrency(
                        data.selectedWorkerData.lodgeRevenue,
                      )}
                      icon={<DollarSign size={18} />}
                      sub="Total Bookings"
                    />
                    <AuditMetric
                      label="Drink Revenue"
                      value={formatCurrency(
                        data.selectedWorkerData.drinkRevenue,
                      )}
                      icon={<Wine size={18} />}
                      sub="Bar Collection"
                    />
                    <AuditMetric
                      label="Expenses"
                      value={formatCurrency(data.selectedWorkerData.expenses)}
                      icon={<Receipt size={18} />}
                      sub="Total Deductions"
                      isNegative
                    />
                    <AuditMetric
                      label="Net Revenue"
                      value={formatCurrency(data.selectedWorkerData.netRevenue)}
                      icon={<Wallet size={18} />}
                      sub="Session Total"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="py-10">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                    <Users size={40} />
                  </div>
                  <p className="text-slate-400 font-black uppercase text-xs tracking-widest">
                    Select staff to audit shift records
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Retrospective & Takeaways */}
      <Card className="rounded-[2.5rem] border-slate-100 shadow-sm bg-white overflow-hidden">
        <div className="p-10 lg:p-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 pb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles size={16} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Monthly Retrospective</h3>
              </div>
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">
                Key Operational <span className="text-primary">Insights</span>
              </h4>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Efficiency Grade</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${data.occupancyRate}%` }} />
                  </div>
                  <span className="font-black text-slate-800">{data.occupancyRate > 60 ? 'A+' : 'B'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {takeaway.map((insight, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <p className="text-slate-500 font-medium leading-relaxed italic text-[15px]">
                  {insight}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-slate-400">
               <TrendingUp size={14} className="text-primary" />
               <p className="text-[11px] font-bold italic">
                 &ldquo;Strategic focus for {month}: sustain revenue velocity and optimize shift consistency.&rdquo;
               </p>
            </div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
               Data-Driven Analysis • {year}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AuditMetric({ label, value, icon, sub, isNegative, isHighlight }: any) {
  return (
    <div className={`p-6 rounded-[2.5rem] border transition-all duration-300 ${isHighlight ? 'bg-primary border-primary shadow-2xl shadow-primary/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
       <div className={`flex items-center justify-between mb-4 ${isHighlight ? 'text-primary-foreground' : 'text-slate-400'}`}>
          <div className="text-[10px] font-black uppercase tracking-widest">{label}</div>
          {icon}
       </div>
       <div className={`text-xl font-black tracking-tight ${isHighlight ? 'text-white' : isNegative ? 'text-rose-400' : 'text-white'}`}>
          {value}
       </div>
       <div className={`text-[9px] font-bold uppercase mt-1 ${isHighlight ? 'text-primary-foreground/60' : 'text-slate-500'}`}>
          {sub}
       </div>
    </div>
  );
}

function KPICard({ title, value, icon, trend, color }: any) {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-lg shadow-slate-200/30 overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
      <CardContent className="p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-2xl ${colors[color]}`}>{icon}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {trend}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {value}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkerSelectionDropdown({
  workers,
  currentWorker,
}: {
  workers: any[];
  currentWorker?: string;
}) {
  const searchParams = useSearchParams();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-2xl font-black text-xs gap-2 border-slate-200 bg-white px-5 h-10 shadow-sm"
        >
          {currentWorker ? currentWorker : 'Select Staff'}
          <ChevronRight size={14} className="rotate-90 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-3xl p-3 shadow-2xl border-slate-100 animate-in slide-in-from-top-2 duration-300"
      >
        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 pb-3">
          Personnel Roster
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mb-2" />
        <div className="space-y-1">
          {workers.map((w) => (
            <Link
              key={w.name}
              href={`/rockins-history?month=${searchParams.get('month')}&year=${searchParams.get('year')}&worker=${w.name}`}
            >
              <DropdownMenuCheckboxItem
                checked={currentWorker?.toLowerCase() === w.name.toLowerCase()}
                className="rounded-2xl py-3 capitalize font-bold text-slate-700 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer"
              >
                {w.name}
              </DropdownMenuCheckboxItem>
            </Link>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
