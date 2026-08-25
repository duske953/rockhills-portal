'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import handleAuth from '../auth/actions/handleAuth';
import { useRouter } from 'next/navigation';
import useLoadingBtn from '@/app/hooks/useLoadingBtn';
import { notify } from '@/app/utils/toast';
import { Loader2Icon } from 'lucide-react';

export default function FormCredentials({
  type,
  action,
}: {
  type: string;
  action: string;
}) {
  const [credentials, setCredentials] = useState({
    name: '',
    password: '',
  });
  const router = useRouter();
  const { loading, setLoading } = useLoadingBtn();

  function renderOnChange(e: ChangeEvent<HTMLInputElement>, field: string) {
    setCredentials((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  }

  async function renderSubmitCredentials(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!credentials.name || !credentials.password) return;
    setLoading(true);
    const response = await handleAuth(
      credentials.name,
      credentials.password,
      type,
      new Date(),
    );
    setLoading(false);

    if (response && response.code === 200) {
      setCredentials({ name: '', password: '' });
      if (type === 'login') router.replace('/portal');
    }
    return notify(
      response?.message || 'Authentication failed',
      'auth',
      response?.code || 500,
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-sm">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {type === 'login' ? 'Sign in' : 'Create account'}
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              {type === 'login'
                ? 'Enter your credentials to access the portal.'
                : 'Set up a new account for a team member.'}
            </p>
          </div>

          <form onSubmit={renderSubmitCredentials} className="space-y-4">
            <input
              value={credentials.name}
              onChange={(e) => renderOnChange(e, 'name')}
              type="text"
              placeholder="Name"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-colors"
            />
            <input
              value={credentials.password}
              onChange={(e) => renderOnChange(e, 'password')}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-colors"
            />

            <button
              disabled={!credentials.name || !credentials.password || loading}
              type="submit"
              className="w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2Icon className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                action
              )}
            </button>
          </form>

          <div className="text-center">
            <Link
              href={`/auth/${type === 'signup' ? 'login' : 'signup'}`}
              className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              {type === 'signup'
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
