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
  const startDate = moment(`${year}-${month}-01`).toDate();
  const endDate = moment(startDate).add(1, 'month').toDate();

  const accountReport = await prisma.worker.findMany({
    where: {
      name: {
        equals: name as string,
        mode: 'insensitive',
      },
      checkInTime: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: {
      checkInTime: 'desc',
    },
    include: { customers: true },
  });
  return (
    <section className="max-w-3xl mx-auto relative py-10 max-sm:px-6">
      <AccountReportTable
        accountReport={accountReport}
        name={name as string}
      ></AccountReportTable>
    </section>
  );
}
