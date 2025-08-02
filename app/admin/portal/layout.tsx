import { buttonVariants } from '@/app/components/ui/button';
import { getCookies } from '@/app/utils/cookies';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import Logout from '../../components/Logout';
import AccountDropdown from '../components/AccocuntDropdown';
import prisma from '@/lib/prisma';

export default async function Page({ children }: { children: ReactNode }) {
  if (!(await getCookies('auth-admin'))) {
    redirect('/admin');
  }

  const accounts = await prisma.account.findMany({ select: { name: true } });

  return (
    <section className="max-sm:pt-16">
      <div className="max-w-3xl mx-auto px-6 py-10 text-center flex flex-col gap-14 relative">
        <h1 className="text-4xl font-bold text-center">Welcome Admin</h1>
        <div className="flex gap-8 justify-center flex-wrap">
          <Link
            className={buttonVariants({ variant: 'outline' })}
            href="/admin/portal/approve-account"
          >
            Approve Account
          </Link>
          <Link
            className={buttonVariants({ variant: 'outline' })}
            href="/admin/portal/deactivate-account"
          >
            Delete Account
          </Link>
          <AccountDropdown accounts={accounts} />
        </div>
        {children}
      </div>
      <Logout cookie="auth-admin" />
    </section>
  );
}
