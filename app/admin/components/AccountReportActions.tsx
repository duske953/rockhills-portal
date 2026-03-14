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

import { CheckCircle2, ArrowUpDown, Clock, Filter } from 'lucide-react';
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
    <div className="flex flex-wrap items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-[2rem] border border-slate-100 shadow-sm self-end">
      {/* Sort Section */}
      <div className="flex items-center gap-2 pl-4 pr-2 py-2 border-r border-slate-100">
        <ArrowUpDown size={14} className="text-slate-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2">
          Sort
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-transparent hover:border-slate-200 transition-all flex items-center gap-2"
            >
              {sortApproved === 'approved' ? (
                <CheckCircle2 size={12} className="text-emerald-500" />
              ) : (
                <Clock size={12} className="text-amber-500" />
              )}
              {sortApproved === 'approved'
                ? 'Approved'
                : sortApproved === 'pending'
                  ? 'Pending'
                  : 'Status'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-2xl p-2 border-slate-100 shadow-xl"
          >
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 pb-2">
              Order By Approval
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              className="rounded-xl mt-1"
              checked={sortApproved === 'approved'}
              onCheckedChange={() => renderSortByApproved('approved')}
            >
              Approved First
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="rounded-xl mt-1"
              checked={sortApproved === 'pending'}
              onCheckedChange={() => renderSortByApproved('pending')}
            >
              Pending First
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-4 pl-2 pr-4 py-2">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Filter
          </span>
        </div>
        <AccountDateFilter type="acc" value={name} />
      </div>
    </div>
  );
}
