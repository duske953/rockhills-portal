import prisma from '@/lib/prisma';
import AccountReportTable from '@/app/components/AccountReportTable';
import { getCookies } from '@/app/utils/cookies';
import moment from 'moment';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let worker;
  const temporaryWorker = await getCookies('temporary-login');
  const name = (await searchParams).acc;
  const month = (await searchParams).month;
  const year = (await searchParams).year;
  if (!name || !month || !year || +month < 1 || +month > 12 || +year < 2000)
    return <div>ken</div>;
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
        isActive: true,
      },
    });
  if (!worker)
    return (
      <section>
        <div className="flex justify-center h-dvh items-center">
          <h1 className="text-4xl text-gray-700">Unauthorized</h1>
        </div>
      </section>
    );

  const accountReport = await prisma.worker.findMany({
    where: {
      name: worker.name,
      checkInTime: {
        gte: moment(`${year}-${+month}-01`).toDate(),
        lt: moment(`${year}-${+month !== 12 ? +month + 1 : 1}-01`).toDate(),
      },
    },

    orderBy: {
      checkInTime: 'desc',
    },
    include: { customers: true },
  });

  return (
    <section className="py-9 max-sm:px-6 relative mx-auto max-w-3xl">
      <AccountReportTable
        accountReport={accountReport}
        name={worker.name}
        type="worker"
      />
    </section>
  );
}
