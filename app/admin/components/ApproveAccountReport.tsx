'use client';

import { Button } from '@/app/components/ui/button';
import handleApproveAccountReport from '../actions/handleApproveAccountReport';
import { notify } from '@/app/utils/toast';
import useLoadingBtn from '@/app/hooks/useLoadingBtn';
import { Loader2Icon } from 'lucide-react';

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
    return notify(response.message, 'approve-account', response.code);
  }
  return (
    <Button
      disabled={loading}
      onClick={renderApproveAccountReport}
      variant="outline"
      className="relative z-[50]"
    >
      {loading && <Loader2Icon className="animate-spin" />}

      {!approved ? 'Approve Report' : 'Disapprove Report'}
    </Button>
  );
}
