import prisma from '@/lib/prisma';
import AccountReportTable from '@/app/components/AccountReportTable';
import { getCookies } from '@/app/utils/cookies';
import moment from 'moment';
import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { buttonVariants } from '@/app/components/ui/button';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let worker;
  const temporaryWorker = await getCookies('temporary-login');
  const accParam = (await searchParams).acc;
  const name = Array.isArray(accParam) ? accParam[0] : accParam;

  const monthParam = (await searchParams).month;
  const month = Array.isArray(monthParam) ? monthParam[0] : monthParam;

  const yearParam = (await searchParams).year;
  const year = Array.isArray(yearParam) ? yearParam[0] : yearParam;

  if (!name || !month || !year || +month < 1 || +month > 12 || +year < 2000)
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-widest">
          Invalid Parameters
        </h1>
        <Link
          href="/portal"
          className={cn(buttonVariants({ variant: 'outline' }), 'rounded-xl')}
        >
          Return to Portal
        </Link>
      </div>
    );

  if (temporaryWorker)
    worker = await prisma.worker.findFirst({
      where: {
        name: {
          equals: temporaryWorker.value,
          mode: 'insensitive',
        },
      },
    });

  if (!temporaryWorker)
    worker = await prisma.worker.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
        isActive: true,
      },
    });

  if (!worker)
    return (
      <section className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-black text-slate-200">401</h1>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
            Unauthorized Access
          </h2>
          <p className="text-slate-500 font-medium">
            You don't have permission to view this audit trail.
          </p>
          <Link
            href="/portal"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'h-12 px-8 rounded-2xl font-bold',
            )}
          >
            Secure Exit
          </Link>
        </div>
      </section>
    );

  const startDate = moment(`${year}-${month}-01`).toDate();
  const endDate = moment(startDate).add(1, 'month').toDate();

  const prevMonthStart = moment(startDate).subtract(1, 'month').toDate();
  const prevMonthEnd = moment(startDate).toDate();

  const [accountReport, prevAccountReport] = await Promise.all([
    prisma.worker.findMany({
      where: {
        name: worker.name,
        checkInTime: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        checkInTime: 'desc',
      },
      include: { customers: true },
    }),
    prisma.worker.findMany({
      where: {
        name: worker.name,
        checkInTime: {
          gte: prevMonthStart,
          lt: prevMonthEnd,
        },
      },
      include: { customers: true },
    }),
  ]);

  return (
    <section className="pb-20 pt-8 px-6 lg:px-10 bg-slate-50/50 min-h-screen w-full overflow-x-hidden">
      <div className="w-full space-y-8">
        {/* Breadcrumb / Nav */}
        <div className="flex items-center gap-4">
          <Link
            href="/portal"
            className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <Home size={10} />
            <span>Portal</span>
            <span className="opacity-30">/</span>
            <span className="text-slate-800">Account Audit</span>
          </div>
        </div>

        <AccountReportTable
          accountReport={accountReport}
          prevAccountReport={prevAccountReport}
          name={worker.name}
          type="worker"
        />
      </div>

      <p className="fixed bottom-6 right-6 text-[10px] text-slate-400 uppercase font-black bg-white/90 backdrop-blur-lg px-4 py-2 rounded-full border border-slate-100 shadow-xl z-50">
        Internal Audit System • Confidential
      </p>
    </section>
  );
}
