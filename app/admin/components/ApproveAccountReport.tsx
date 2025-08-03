'use client';

import { Button } from '@/app/components/ui/button';
import handleApproveAccountReport from '../actions/handleApproveAccountReport';
import { notify } from '@/app/utils/toast';

export default function ApproveAccountReport({
  id,
  approved,
}: {
  id: string;
  approved: boolean;
}) {
  async function renderApproveAccountReport() {
    const response = await handleApproveAccountReport(id);

    return notify(response.message, 'approve-account', response.code);
  }
  return (
    <Button
      onClick={renderApproveAccountReport}
      variant="outline"
      className="relative z-[50]"
    >
      {!approved ? 'Approve Report' : 'Disapprove Report'}
    </Button>
  );
}
