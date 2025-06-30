import AccountReportTable from '@/app/components/AccountReportTable';
import prisma from '@/lib/prisma';

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const name = (await searchParams).acc;

  const accountReport = await prisma.worker.findMany({
    where: {
      name: {
        equals: name as string,
        mode: 'insensitive',
      },
    },

    include: { customers: true },
    orderBy: {
      checkInTime: 'desc',
    },
  });

  if (accountReport.length <= 0)
    return (
      <section>
        <div className="flex justify-center items-center h-dvh">
          <h1 className="text-4xl font-semibold text-gray-700">
            "{name}" has no account report yet.
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
