'use client';

import { Button } from '@/app/components/ui/button';
import handleApproveAccount from '../actions/handleApproveAccount';
import useLoadingBtn from '@/app/hooks/useLoadingBtn';
import { notify } from '@/app/utils/toast';
import { cn } from '@/app/lib/utils';
import handleDeactivateAccount from '../actions/handleDeactivateAccount';

export default function AccountList({
  acc,
  type,
  action,
}: {
  acc: { name: string; id: string; active: boolean };
  type: string;
  action: string;
}) {
  const { loading, setLoading } = useLoadingBtn();
  async function renderApproveAccount(id: string) {
    setLoading(true);
    const response =
      action === 'delete-account'
        ? await handleDeactivateAccount(id)
        : await handleApproveAccount(id, acc.active);
    setLoading(false);
    if (!response) return notify('Something went wrong', 'auth-admin', 500);
    return notify(response.message, 'auth-admin', response.code);
  }
  return (
    <li className="flex items-center justify-between w-full max-w-md bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">
        {acc.name}
      </p>
      <Button
        onClick={() => renderApproveAccount(acc.id)}
        disabled={loading}
        className={cn(
          type.toLowerCase().includes('delete') || type.toLowerCase().includes('deactivate') || type.toLowerCase().includes('reject')
            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100'
            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100',
          'h-8 px-4 rounded-lg font-bold text-[10px] uppercase tracking-widest border transition-colors shadow-none',
        )}
        variant="outline"
        size="sm"
      >
        {type}
      </Button>
    </li>
  );
}
