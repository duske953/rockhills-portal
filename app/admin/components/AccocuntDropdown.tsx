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

import {
  UserCircle2,
  ChevronDown,
  Search,
  CheckCircle2,
  FileText,
} from 'lucide-react';

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
          className="h-12 px-6 rounded-2xl flex items-center gap-3 bg-white border-slate-100 shadow-sm hover:border-primary/50 hover:bg-slate-50 transition-all font-black uppercase text-[10px] tracking-widest"
        >
          <UserCircle2 size={18} className="text-primary" />
          <span>Select Account Report</span>
          <ChevronDown
            size={14}
            className="text-slate-400 group-hover:text-primary transition-colors"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-72 p-2 rounded-[1.5rem] border-slate-100 shadow-2xl animate-in fade-in zoom-in duration-200"
        align="start"
      >
        <div className="px-4 py-3 mb-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Search size={10} />
            Personnel Directory
          </p>
        </div>

        <DropdownMenuSeparator className="bg-slate-50 mx-2" />

        <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1 space-y-1 mt-1">
          {accounts.map((acc) => {
            const isActive =
              acc.name.toLowerCase() === activeAcc?.toLowerCase();
            return (
              <DropdownMenuItem
                key={acc.name}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer group',
                  isActive
                    ? 'bg-primary/5 border border-primary/10'
                    : 'hover:bg-slate-50',
                )}
                asChild
              >
                <Link
                  href={`/admin/account-report/?acc=${acc.name}&month=${
                    new Date().getMonth() + 1
                  }&year=${new Date().getFullYear()}`}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                        isActive
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary',
                      )}
                    >
                      <FileText size={14} />
                    </div>
                    <div>
                      <p
                        className={cn(
                          'text-xs font-black capitalize',
                          isActive ? 'text-primary' : 'text-slate-700',
                        )}
                      >
                        {acc.name}
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                        View Audit Trail
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <CheckCircle2
                      size={14}
                      className="text-primary animate-in zoom-in"
                    />
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
