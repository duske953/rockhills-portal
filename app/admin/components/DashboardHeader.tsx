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
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="w-full px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  System Online
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-slate-900 font-bold text-xs uppercase tracking-widest">
                  {months[activeMonth - 1]} {new Date().getFullYear()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {months.map((month, idx) => (
                <button
                  key={month}
                  onClick={() => handleMonthClick(idx + 1)}
                  className={cn(
                    'w-7 h-7 rounded-lg transition-colors flex items-center justify-center text-[10px] font-bold uppercase',
                    activeMonth === idx + 1
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                  )}
                  title={month}
                >
                  {month.charAt(0)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}