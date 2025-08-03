import prisma from '@/lib/prisma';
import Link from 'next/link';
import { cn } from '../lib/utils';
import { buttonVariants } from '../components/ui/button';
import DeregisterRoom from './components/DeRegisterRoom';
import { getCookies } from '../utils/cookies';
import TemporaryLogin from './components/TemporaryLogin';
import { redirect } from 'next/navigation';
import RegisterCustomer from './components/RegisterCustomer';

export default async function Page() {
  const temporaryWorker = await getCookies('temporary-login');
  const isUserAuth = await getCookies('authenticated');
  const activeUser = await prisma.worker.findFirst({
    take: 1,
    where: {
      isActive: true,
    },

    orderBy: {
      checkInTime: 'desc',
    },
  });

  if (temporaryWorker && temporaryWorker.value)
    return <TemporaryLogin name={temporaryWorker.value} />;
  if (!isUserAuth?.value || !activeUser) redirect('/auth/login');
  if (
    activeUser.name.toLocaleLowerCase() !== isUserAuth.value.toLocaleLowerCase()
  )
    redirect('/auth/login');

  return (
    <section className="pb-10">
      <div className="max-w-4xl mx-auto px-3 py-4 text-center relative">
        <p className="py-8 text-3xl text-gray-600 font-bold">
          Welcome {activeUser?.name || 'Guest'}
        </p>

        <RegisterCustomer />

        <div className="absolute right-3 gap-5 flex max-sm:py-10">
          <Link
            className={cn(buttonVariants({ variant: 'outline' }))}
            href="/portal/account-report"
          >
            Account Report
          </Link>
          <DeregisterRoom />
        </div>
      </div>
      <p className="absolute text-xs right-3 top-3 text-red-500 uppercase font-semibold">
        Ensure all fields are correct before proceeding
      </p>
    </section>
  );
}
