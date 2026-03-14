'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from './ui/dropdown-menu';
import { ChangeEvent, useState } from 'react';
import moment from 'moment';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import { CalendarDays, ChevronDown, Check } from 'lucide-react';

const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function AccountDateFilter({
  type,
  value,
}: {
  type?: string | null;
  value?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [activeDate, setActiveDate] = useState({
    month: Number(searchParams.get('month')) || moment().get('month') + 1,
    year: searchParams.get('year') || moment().get('year'),
  });

  function renderActiveDate(month: number, year: number) {
    setActiveDate({ month, year });
  }

  function renderActiveYear(e: ChangeEvent<HTMLInputElement>) {
    setActiveDate((prev) => ({
      ...prev,
      year: +e.target.value || moment().get('year'),
    }));
  }

  function renderSubmitReportYear() {
    router.push(
      `${pathname}?month=${activeDate.month}&year=${activeDate.year}${
        pathname === '/rockins-history' ? '' : `&acc=${searchParams.get('acc')}`
      }`,
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Month Picker */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-transparent hover:border-slate-200 transition-all flex items-center gap-2 px-3"
          >
            <CalendarDays size={12} className="text-primary" />
            {monthList[activeDate.month - 1]}
            <ChevronDown size={10} className="opacity-40" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="rounded-2xl p-2 border-slate-100 shadow-xl max-h-[300px] overflow-y-auto"
        >
          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 pb-2">
            Select Month
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {monthList.map((m, i) => (
            <Link
              key={m}
              href={`${pathname}?month=${i + 1}&year=${activeDate.year}${
                type ? `&${type}=${value}` : ''
              }`}
            >
              <DropdownMenuCheckboxItem
                className="rounded-xl mt-1"
                checked={activeDate.month === i + 1}
                onCheckedChange={() =>
                  renderActiveDate(i + 1, activeDate.year as number)
                }
              >
                {m}
              </DropdownMenuCheckboxItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Year Input and Submit */}
      <div className="flex items-center bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/5 transition-all pl-3 overflow-hidden">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
          'YY
        </span>
        <input
          value={activeDate.year}
          onChange={renderActiveYear}
          placeholder="Year"
          className="w-14 bg-transparent border-none text-xs font-black text-slate-700 focus:ring-0 px-2 py-1 placeholder:text-slate-300"
        />
        <button
          onClick={renderSubmitReportYear}
          className="bg-primary hover:bg-primary/90 text-white p-1.5 transition-colors"
        >
          <Check size={14} />
        </button>
      </div>
    </div>
  );
}

// /admin/account-report?acc=${name}
