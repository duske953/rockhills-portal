import { getCookies } from '@/app/utils/cookies';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import Logout from '../../components/Logout';
export default async function Page({ children }: { children: ReactNode }) {
  if (!(await getCookies('auth-admin'))) {
    redirect('/admin');
  }

  return (
    <section className="bg-slate-50/30 min-h-screen">
      <div className="w-full">{children}</div>

      <Logout cookie="auth-admin" />
    </section>
  );
}
