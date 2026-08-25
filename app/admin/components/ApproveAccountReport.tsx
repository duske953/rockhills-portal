'use client';

import { Button } from '@/app/components/ui/button';
import handleApproveAccountReport from '../actions/handleApproveAccountReport';
import { notify } from '@/app/utils/toast';
import useLoadingBtn from '@/app/hooks/useLoadingBtn';
import { Loader2Icon, CheckCircle2, XCircle } from 'lucide-react';

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
    <Button
      disabled={loading}
      onClick={renderApproveAccountReport}
      className={
        approved
          ? 'min-w-[140px] h-9 px-4 rounded-lg text-xs font-semibold tracking-wide border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors'
          : 'min-w-[140px] h-9 px-4 rounded-lg text-xs font-semibold tracking-wide border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors'
      }
    >
      {loading ? (
        <Loader2Icon className="w-3 h-3 animate-spin" />
      ) : approved ? (
        <>
          <XCircle className="w-3.5 h-3.5" />
          Disapprove
        </>
      ) : (
        <>
          <CheckCircle2 className="w-3.5 h-3.5" />
          Approve
        </>
      )}
    </Button>
  );
}
