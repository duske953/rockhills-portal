'use client';

import { Button } from '@/app/components/ui/button';
import useLoadingBtn from '@/app/hooks/useLoadingBtn';
import { notify } from '@/app/utils/toast';
import revalidate from '@/app/utils/revalidate';
import handleLogout from '../utils/handleLogout';

export default function Logout({ cookie }: { cookie: string }) {
  const { loading, setLoading } = useLoadingBtn();
  async function renderLogout() {
    setLoading(true);
    const response = await handleLogout(cookie);
    setLoading(false);
    if (response.code === 200) await revalidate('/portal');
    return notify(response.message, 'logout', response.code);
  }
  return (
    <Button
      disabled={loading}
      onClick={renderLogout}
      variant="outline"
      className="absolute right-3 top-3 cursor-pointer"
    >
      Logout
    </Button>
  );
}
