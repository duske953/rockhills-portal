'use client';

import BtnLoader from '@/app/components/BtnLoader';
import { useRouter } from 'next/navigation';
import { Input } from '@/app/components/ui/input';
import useLoadingBtn from '@/app/hooks/useLoadingBtn';
import { FormEvent, useState } from 'react';
import handleAuthAdmin from '../actions/handleAuthAdmin';
import { notify } from '@/app/utils/toast';

export default function InputAdminPassword() {
  const [adminPassword, setAdminPassword] = useState('');
  const { loading, setLoading } = useLoadingBtn();
  const router = useRouter();
  async function renderAuthAdmin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!adminPassword) return;
    setLoading(true);
    const response = await handleAuthAdmin(adminPassword);
    setLoading(false);
    if (response.code === 200) router.replace('/admin/portal');
    return notify(response.message, 'auth', response.code);
  }

  return (
    <form onSubmit={renderAuthAdmin} className="flex flex-col gap-3">
      <Input
        onChange={(e) => setAdminPassword(e.target.value)}
        placeholder="Admin password"
      />
      <BtnLoader disabled={!adminPassword || loading} loading={loading} />
    </form>
  );
}
