import AccountDateFilter from '@/app/components/AccountDateFilter';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

import { CheckCircle2, ArrowUpDown, Clock } from 'lucide-react';
import { useState } from 'react';

interface AccountReport {
  approved: boolean;
  [key: string]: any;
}

export default function AccountReportActions({
  currAccountReport,
  setCurrAccountReport,
  name,
}: {
  currAccountReport: AccountReport[];
  setCurrAccountReport: (reports: AccountReport[]) => void;
  name: string;
}) {
  const [sortApproved, setSortApproved] = useState('');

  function renderSortByApproved(status: string) {
    setSortApproved(status);
    setCurrAccountReport(
      currAccountReport.toSorted(
        (a: { approved: boolean }, b: { approved: boolean }): number => {
          return status === 'approved'
            ? (b.approved ? 1 : 0) - (a.approved ? 1 : 0)
            : (a.approved ? 1 : 0) - (b.approved ? 1 : 0);
        },
      ),
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 bg-white p-1 rounded-xl border border-slate-100 shadow-sm self-end">
      {/* Sort Section */}
      <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 border-r border-slate-50">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Sort
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-[10px] border border-slate-100 transition-colors flex items-center gap-2"
            >
              {sortApproved === 'approved' ? (
                <CheckCircle2 size={12} className="text-emerald-500" />
              ) : sortApproved === 'pending' ? (
                <Clock size={12} className="text-amber-500" />
              ) : (
                <ArrowUpDown size={12} />
              )}
              {sortApproved === 'approved'
                ? 'Approved First'
                : sortApproved === 'pending'
                  ? 'Pending First'
                  : 'Status'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl p-1 border-slate-100 shadow-lg"
          >
            <DropdownMenuLabel className="text-[9px] font-bold uppercase tracking-widest text-slate-400 px-2 py-1.5">
              Order By Approval
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              className="rounded-lg text-xs"
              checked={sortApproved === 'approved'}
              onCheckedChange={() => renderSortByApproved('approved')}
            >
              Approved First
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="rounded-lg text-xs"
              checked={sortApproved === 'pending'}
              onCheckedChange={() => renderSortByApproved('pending')}
            >
              Pending First
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-3 pl-2 pr-3 py-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Filter
        </span>
        <AccountDateFilter type="acc" value={name} />
      </div>
    </div>
  );
}
