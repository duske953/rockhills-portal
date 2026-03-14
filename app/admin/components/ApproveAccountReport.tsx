'use client';

import { Button } from '@/app/components/ui/button';
import handleApproveAccountReport from '../actions/handleApproveAccountReport';
import { notify } from '@/app/utils/toast';
import useLoadingBtn from '@/app/hooks/useLoadingBtn';
import { Loader2Icon, Fingerprint, ShieldCheck } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function ApproveAccountReport({
  id,
  approved,
}: {
  id: string;
  approved: boolean;
}) {
  const { loading, setLoading } = useLoadingBtn();

  async function renderApproveAccountReport() {
    setLoading(true);
    const response = await handleApproveAccountReport(id);
    setLoading(false);
    if (!response)
      return notify('Something went wrong', 'approve-account', 500);
    return notify(response.message, 'approve-account', response.code);
  }

  return (
    <div className="relative group">
      {/* Background Glow Effect */}
      <div
        className={cn(
          'absolute -inset-1 blur opacity-20 group-hover:opacity-40 transition duration-500 rounded-2xl',
          approved ? 'bg-emerald-400' : 'bg-rose-400',
        )}
      />

      <Button
        disabled={loading}
        onClick={renderApproveAccountReport}
        className={cn(
          'relative min-w-[160px] h-11 px-6 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] transition-all duration-500 overflow-hidden border-2',
          approved
            ? 'bg-white/80 text-emerald-600 border-emerald-200/50 hover:bg-emerald-50 shadow-xl shadow-emerald-500/10'
            : 'bg-white/80 text-rose-600 border-rose-200/50 hover:bg-rose-50 shadow-xl shadow-rose-500/10',
        )}
      >
        <div className="flex items-center gap-2.5 relative z-10">
          {loading ? (
            <Loader2Icon className="w-3 h-3 animate-spin" />
          ) : approved ? (
            <div className="relative">
              <Fingerprint className="w-4 h-4 animate-in zoom-in duration-500" />
              <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          ) : (
            <ShieldCheck className="w-4 h-4 text-rose-400 group-hover:rotate-12 transition-transform" />
          )}

          <span className="mt-0.5">
            {loading
              ? 'Processing...'
              : approved
                ? 'Disapprove Report'
                : 'Approve Report'}
          </span>
        </div>

        {/* Shine Animation */}
        <div className="absolute inset-x-0 h-full w-12 bg-white/20 -skew-x-12 animate-[shine_3s_infinite] translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />
      </Button>
    </div>
  );
}
