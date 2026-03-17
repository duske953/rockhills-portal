'use client';
import { useState } from 'react';
import { Activity, Calendar } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const monthsColors = [
  'bg-rose-500', 'bg-rose-400', 'bg-orange-500', 'bg-yellow-500',
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
];

export default function DashboardHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeMonth] = useState(() => {
    return Number(searchParams.get('month')) || 3;
  });

  const handleMonthClick = (m: number) => {
    router.push(`admin/portal?month=${m}&year=${new Date().getFullYear()}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-lg shadow-slate-200/40">
        <div className="w-full px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-600 text-sm font-black uppercase tracking-widest">
                  ● System Active
                </span>
              </div>
              <div className="h-px flex-1 md:w-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <div className="flex items-center gap-3">
                <Calendar className="text-primary w-5 h-5" />
                <span className="text-slate-800 font-black text-sm uppercase tracking-tight">
                  {months[activeMonth - 1]} 2026
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl px-3 py-2 border border-primary/20">
                <Activity className="w-4 h-4 text-primary mr-2" />
                <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                  Session Monitored
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            {months.map((month, idx) => (
              <button
                key={month}
                onClick={() => handleMonthClick(idx + 1)}
                className={cn(
                  'w-8 h-8 rounded-xl transition-all duration-300 flex items-center justify-center text-xs font-black uppercase',
                  activeMonth === idx + 1
                    ? monthsColors[idx % 12] + ' text-white shadow-lg shadow-primary/30 scale-110'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                )}
                title={month}
              >
                {month.charAt(0)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="w-full mt-20" />
    </>
  );
}