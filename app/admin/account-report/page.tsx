import AccountReportTable from '@/app/components/AccountReportTable';
import prisma from '@/lib/prisma';
import moment from 'moment';

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const name = (await searchParams).acc;
  const month = (await searchParams).month;
  const year = (await searchParams).year;
  if (!name || !month || !year || +month < 1 || +month > 12 || +year < 2000)
    return <div>ken</div>;
  const accountReport = await prisma.worker.findMany({
    where: {
      name: {
        equals: name as string,
        mode: 'insensitive',
      },
      checkInTime: {
        gte: moment(`${year}-${+month}-01`).toDate(),
        lt: moment(`${year}-${+month !== 12 ? +month + 1 : 1}-01`).toDate(),
      },
    },

    include: { customers: true },
    orderBy: {
      checkInTime: 'desc',
    },
  });

  if (accountReport.length <= 0)
    return (
      <section className="px-6">
        <div className="flex justify-center items-center h-dvh">
          <h1 className="text-4xl font-semibold text-gray-700 max-sm:text-3xl text-center">
            {name} has no account report yet.
          </h1>
        </div>
      </section>
    );
  return (
    <section className="max-w-3xl mx-auto relative py-10 max-sm:px-6">
      <AccountReportTable
        accountReport={accountReport}
        name={name as string}
      ></AccountReportTable>
    </section>
  );
}
