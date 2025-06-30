import prisma from '@/lib/prisma';
import AccountReportTable from '@/app/components/AccountReportTable';
import { getCookies } from '@/app/utils/cookies';

export default async function Page() {
  let worker;
  const temporaryWorker = await getCookies('temporary-login');
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
