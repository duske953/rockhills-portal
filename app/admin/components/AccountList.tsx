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
    return notify(response.message, 'auth-admin', response.code);
  }
  return (
    <li className="flex items-center gap-16 justify-center">
      <p className="uppercase font-semibold text-gray-700 ">{acc.name}</p>
      <Button
        onClick={() => renderApproveAccount(acc.id)}
        disabled={loading}
        className={cn(
          type === 'Delete Account' &&
            'bg-red-800 hover:bg-red-700 hover:text-white text-white',
          'cursor-pointer'
        )}
        variant="outline"
        size="sm"
      >
        {type}
      </Button>
    </li>
  );
}
