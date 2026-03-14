'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import handleAuth from '../auth/actions/handleAuth';
import { useRouter } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import useLoadingBtn from '@/app/hooks/useLoadingBtn';
import { notify } from '@/app/utils/toast';
import {
  User,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Loader2Icon,
  Fingerprint,
} from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-6 relative overflow-hidden text-slate-900">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-[440px] relative z-10">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="p-10 space-y-8">
            {/* Form Header */}
            <div className="space-y-3 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2 mx-auto">
                <ShieldCheck size={12} />
                Secure Terminal
              </div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                {type === 'login' ? 'Welcome' : 'Register'}{' '}
                <span className="text-primary">Back</span>
              </h2>
              <p className="text-slate-500 font-medium text-sm">
                {type === 'login'
                  ? 'Access the hotel management portal with your professional credentials.'
                  : 'Establish your administrative profile to begin operations.'}
              </p>
            </div>

            <form onSubmit={renderSubmitCredentials} className="space-y-5">
              <div className="space-y-4">
                {/* Name Input */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    value={credentials.name}
                    onChange={(e) => renderOnChange(e, 'name')}
                    type="text"
                    placeholder="User ID / Name"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all font-medium"
                  />
                </div>

                {/* Password Input */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    value={credentials.password}
                    onChange={(e) => renderOnChange(e, 'password')}
                    type="password"
                    placeholder="Access Key"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                disabled={!credentials.name || !credentials.password || loading}
                type="submit"
                className={cn(
                  'w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[11px] tracking-widest transition-all duration-300 relative overflow-hidden group shadow-lg',
                  loading
                    ? 'bg-slate-100 text-slate-400'
                    : 'bg-primary text-white hover:bg-slate-900 shadow-primary/20',
                )}
              >
                {loading ? (
                  <Loader2Icon className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Fingerprint
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span>
                      {action} {type === 'login' ? 'Portal' : 'Account'}
                    </span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 text-center">
              <Link
                href={`/auth/${type === 'signup' ? 'login' : 'signup'}`}
                className="text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest flex items-center justify-center gap-2 group"
              >
                {type === 'signup'
                  ? 'Already have an account? Sign In'
                  : 'New personnel? Create Account'}
                <Sparkles
                  size={12}
                  className="group-hover:rotate-12 transition-transform opacity-0 group-hover:opacity-100"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            RockHills Luxury Suites • Enterprise v2.1
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-300">
            <div className="h-px w-8 bg-slate-200" />
            <ShieldCheck size={14} />
            <div className="h-px w-8 bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
