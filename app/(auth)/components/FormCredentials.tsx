'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import handleAuth from '../auth/actions/handleAuth';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import useLoadingBtn from '@/app/hooks/useLoadingBtn';
import { notify } from '@/app/utils/toast';
import { Loader2Icon } from 'lucide-react';

type DayPrompt = { date: string; today: string };

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
  const [blockedMessage, setBlockedMessage] = useState('');
  const [dayPrompt, setDayPrompt] = useState<DayPrompt | null>(null);
  const [lateMode, setLateMode] = useState(false);
  const [reason, setReason] = useState('');
  const [dayError, setDayError] = useState('');
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
    setBlockedMessage('');
    setLoading(true);
    const now = new Date();
    const response = await handleAuth(
      credentials.name,
      credentials.password,
      type,
      now,
      now.getTimezoneOffset(),
    );
    setLoading(false);

    // Login window closed — show the message on the page, not as a toast
    if (response?.code === 423) return setBlockedMessage(response.message);

    // Yesterday has no shift — ask whether that one day was worked
    if (response?.code === 428) {
      setDayPrompt(response.data as DayPrompt);
      setLateMode(false);
      setReason('');
      return;
    }

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

  async function submitShift(shiftDay: string, lateReason?: string) {
    setDayError('');
    setLoading(true);
    const now = new Date();
    const response = await handleAuth(
      credentials.name,
      credentials.password,
      type,
      now,
      now.getTimezoneOffset(),
      shiftDay,
      lateReason,
    );
    setLoading(false);

    if (response?.code === 200) {
      setDayPrompt(null);
      setLateMode(false);
      if (type === 'login') return router.replace('/portal');
    }
    return setDayError(response?.message || 'Something went wrong');
  }

  function renderLogInToday() {
    if (!dayPrompt) return;
    setLateMode(false);
    return submitShift(dayPrompt.today);
  }

  async function renderRecordDay(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dayPrompt) return;
    if (reason.trim().length < 10)
      return setDayError('Give a reason of at least 10 characters.');
    return submitShift(dayPrompt.date, reason.trim());
  }

  if (dayPrompt) {
    const missingDay = moment(dayPrompt.date);
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <form
          onSubmit={renderRecordDay}
          className="w-full max-w-sm space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              No shift on {missingDay.format('dddd, MMMM Do')}
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              Nobody was logged in that day. If you worked it, file it on its
              real date and say why — otherwise continue with today.
            </p>
          </div>

          {dayError && (
            <div
              role="alert"
              className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
            >
              {dayError}
            </div>
          )}

          {lateMode ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Why was {missingDay.format('dddd')} not recorded?
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  autoFocus
                  placeholder="e.g. Forgot to log in, guests were written in the book"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2Icon className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  `Record for ${missingDay.format('ddd, MMM D')}`
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLateMode(false);
                  setDayError('');
                }}
                className="w-full text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Back
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                disabled={loading}
                onClick={renderLogInToday}
                className="w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2Icon className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  'Log in for today'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLateMode(true);
                  setDayError('');
                }}
                className="w-full py-3 bg-white text-slate-600 rounded-lg border border-slate-200 text-sm font-semibold hover:border-slate-300 transition-colors"
              >
                I worked {missingDay.format('dddd, MMM Do')}
              </button>
            </div>
          )}
        </form>
      </div>
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

          {blockedMessage && (
            <div
              role="alert"
              className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
            >
              {blockedMessage}
            </div>
          )}

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
