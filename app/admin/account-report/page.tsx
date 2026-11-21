import AccountReportTable from '@/app/components/AccountReportTable';
import prisma from '@/lib/prisma';
import moment from 'moment';

const LOGIN_CLOSE_HOUR = 18;

type Day = moment.Moment;

// Every day nothing was recorded anywhere, from the first shift of the month
// so days before the app was in use stay quiet. Today only counts once the
// login window has closed.
function findEmptyDays(
  monthStart: Day,
  monthEnd: Day,
  firstShiftDay: Day | null,
) {
  if (!firstShiftDay) return [];
  const emptyDays: string[] = [];
  const today = moment().startOf('day');
  const stopAt =
    moment().hour() >= LOGIN_CLOSE_HOUR
      ? today
      : today.clone().subtract(1, 'day');
  let day = firstShiftDay.clone().startOf('day');
  if (day.isBefore(monthStart)) day = monthStart.clone().startOf('day');

  while (day.isSameOrBefore(stopAt) && day.isBefore(monthEnd)) {
    emptyDays.push(day.format('YYYY-MM-DD'));
    day = day.clone().add(1, 'day');
  }
  return emptyDays;
}

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const name = (await searchParams).acc;
  const month = (await searchParams).month;
  const year = (await searchParams).year;
  if (!name || !month || !year || +month < 1 || +month > 12 || +year < 2000)
    return <div>null</div>;
  const startDate = moment(`${year}-${month}-01`).toDate();
  const endDate = moment(startDate).add(1, 'month').toDate();

  const prevMonthStart = moment(startDate).subtract(1, 'month').toDate();
  const prevMonthEnd = moment(startDate).toDate();

  const [accountReport, prevAccountReport, monthShifts] = await Promise.all([
    prisma.worker.findMany({
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
    }),
    prisma.worker.findMany({
      where: {
        name: {
          equals: name as string,
          mode: 'insensitive',
        },
        checkInTime: {
          gte: prevMonthStart,
          lt: prevMonthEnd,
        },
      },
      include: { customers: true },
    }),
    prisma.worker.findMany({
      where: { checkInTime: { gte: startDate, lt: endDate } },
      select: { checkInTime: true },
    }),
  ]);

  const recordedDays = new Set(
    monthShifts.map((shift) => moment(shift.checkInTime).format('YYYY-MM-DD')),
  );
  const firstShiftDay = monthShifts.length
    ? moment(
        Math.min(...monthShifts.map((shift) => shift.checkInTime.getTime())),
      )
    : null;
  const emptyDays = findEmptyDays(
    moment(startDate),
    moment(endDate),
    firstShiftDay,
  ).filter((day) => !recordedDays.has(day));

  return (
    <section className="max-w-7xl mx-auto relative py-8 px-4 sm:px-6">
      <AccountReportTable
        accountReport={accountReport}
        prevAccountReport={prevAccountReport}
        name={name as string}
        emptyDays={emptyDays}
      ></AccountReportTable>
    </section>
  );
}
