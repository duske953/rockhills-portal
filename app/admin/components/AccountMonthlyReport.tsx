'use client';

import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import { DisplayAmount } from '@/app/rockins-history/components/DisplayAmount';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AccountMonthlyReport({
  worker,
  account,
  isCurrWorkerApproved,
}: {
  worker: Array<{
    customers: Array<{ amount: number }>;
    expenses: Array<{ amount: number }> | null;
    drinkSales: { pos: number; cash: number };
  }>;
  account: Array<{ name: string }>;
  isCurrWorkerApproved: boolean;
}) {
  const searchParams = useSearchParams();
  const workerName = searchParams.get('worker');
  const totalLodgers = worker
    .filter((w) => w.customers)
    .reduce((acc, w) => acc + w.customers.length, 0);
  const totalLodgeRevenue = worker
    .filter((w) => w.customers)
    .reduce(
      (acc, c) =>
        acc +
        c.customers.reduce((sum, lodger) => sum + (lodger.amount || 0), 0),
      0
    );
  const totalExpenses = worker
    .filter((w) => w.expenses)
    .reduce(
      (acc, w) =>
        acc +
        (Array.isArray(w.expenses)
          ? w.expenses.reduce(
              (sum, expense: any) => sum + (expense.amount || 0),
              0
            )
          : 0),
      0
    );
  const totalDrinkRevenue = worker
    .filter((w) => w.drinkSales)
    .reduce((acc, w) => acc + w.drinkSales.pos + w.drinkSales.cash, 0);

  return (
    <section className="pt-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Worker Monthly Report</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-sm:w-64">
          <DropdownMenuLabel>Workers</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {account.map((w) => (
            <DropdownMenuCheckboxItem
              checked={
                searchParams.get('worker')?.toLowerCase() ===
                w.name.toLowerCase()
              }
              className="size-full"
              key={w.name}
            >
              <Link
                className="size-full"
                href={`/rockins-history?month=${searchParams.get(
                  'month'
                )}&year=2025&worker=${w.name}`}
              >
                {w.name.charAt(0).toUpperCase() + w.name.slice(1)}
              </Link>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {worker.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No data available for the selected worker.
        </p>
      )}
      {!isCurrWorkerApproved && (
        <p className="text-center text-gray-500 mt-10">
          <span className="capitalize">{searchParams.get('worker')}</span>'s
          account has not been totally approved yet. Please contact the
          administrator.
        </p>
      )}
      {worker.length > 0 && isCurrWorkerApproved && (
        <div className="py-5">
          <p className="text-4xl text-gray-700 font-bold">
            Monthly report for {workerName}
          </p>
          <ul className="list-disc list-inside text-left mt-6 space-y-2 text-xl flex flex-col gap-3">
            <p>
              <span className="capitalize">{workerName}</span>, had{' '}
              <span className="font-bold">{totalLodgers} </span>
              lodgers for the month of September
            </p>
            <DisplayAmount type="Lodge Revenue" amount={totalLodgeRevenue} />
            <DisplayAmount type="Drink Revenue" amount={totalDrinkRevenue} />
            <DisplayAmount type="Expenses" amount={totalExpenses} />
            <DisplayAmount
              type="Revenue"
              amount={totalDrinkRevenue + totalLodgeRevenue}
            />
            <DisplayAmount
              type="Approved Revenue"
              amount={totalDrinkRevenue + totalLodgeRevenue - totalExpenses}
            />
          </ul>
        </div>
      )}
    </section>
  );
}
