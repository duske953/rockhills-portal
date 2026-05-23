'use client';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { cn } from '@/app/lib/utils';
import Link from 'next/link';

import { UserCircle2, ChevronDown, CheckCircle2, FileText } from 'lucide-react';

export default function AccountDropdown({
  accounts,
  activeAcc,
}: {
  accounts: Array<{ name: string }>;
  activeAcc: string | undefined;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-10 px-4 rounded-xl flex items-center gap-2 bg-white border-slate-100 hover:bg-slate-50 transition-colors font-bold uppercase text-[10px] tracking-widest"
        >
          <UserCircle2 size={16} className="text-slate-400" />
          <span>Select Account Report</span>
          <ChevronDown size={12} className="text-slate-300" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 p-1 rounded-xl border-slate-100 shadow-xl"
        align="start"
      >
        <DropdownMenuSeparator className="bg-slate-50 mx-1" />

        <div className="max-h-[300px] overflow-y-auto p-1 space-y-0.5">
          {accounts.map((acc) => {
            const isActive =
              acc.name.toLowerCase() === activeAcc?.toLowerCase();
            return (
              <DropdownMenuItem
                key={acc.name}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer',
                  isActive
                    ? 'bg-gray-200 text-slate-900'
                    : 'hover:bg-slate-50 text-slate-700',
                )}
                asChild
              >
                <Link
                  href={`/admin/account-report/?acc=${acc.name}&month=${
                    new Date().getMonth() + 1
                  }&year=${new Date().getFullYear()}`}
                  className="w-full"
                >
                  <div className="flex items-center gap-2">
                    <FileText
                      size={12}
                      className={isActive ? 'text-slate-400' : 'text-slate-300'}
                    />
                    <span className="text-xs font-bold capitalize">
                      {acc.name}
                    </span>
                  </div>

                  {isActive && (
                    <CheckCircle2 size={12} className="text-white" />
                  )}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
