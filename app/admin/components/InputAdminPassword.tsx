'use client';
import { useRouter } from 'next/navigation';
import useLoadingBtn from '@/app/hooks/useLoadingBtn';
import { FormEvent, useState } from 'react';
import handleAuthAdmin from '../actions/handleAuthAdmin';
import { notify } from '@/app/utils/toast';
import { Loader2Icon } from 'lucide-react';

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
    <form onSubmit={renderAuthAdmin} className="space-y-4">
      <input
        onChange={(e) => setAdminPassword(e.target.value)}
        type="text"
        placeholder="Password"
        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-colors"
      />
      <button
        disabled={!adminPassword || loading}
        type="submit"
        className="w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2Icon className="w-4 h-4 animate-spin mx-auto" />
        ) : (
          'Continue'
        )}
      </button>
    </form>
  );
}
