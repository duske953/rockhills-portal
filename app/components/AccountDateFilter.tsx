'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from './ui/dropdown-menu';
import { ChangeEvent, useState } from 'react';
import moment from 'moment';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Input } from './ui/input';

const month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function AccountDateFilter({
  type,
  value,
}: {
  type?: string | null;
  value?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  console.log(pathname);
  const router = useRouter();
  const [activeDate, setActiveDate] = useState({
    month: Number(searchParams.get('month')) || moment().get('month') + 1,
    year: searchParams.get('year') || moment().get('year'),
  });
  function renderActiveDate(month: number, year: number) {
    setActiveDate({ month, year });
  }

  function renderActiveYear(e: ChangeEvent<HTMLInputElement>) {
    setActiveDate((prev) => ({
      ...prev,
      year: +e.target.value || moment().get('year'),
    }));
  }

  function renderSubmitReportYear() {
    router.push(
      `${pathname}?month=${activeDate.month}&year=${activeDate.year}${
        pathname === '/rockins-history' ? '' : `&acc=${searchParams.get('acc')}`
      }`
    );
  }

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Month</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Approved Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {month.map((m, i) => (
            <Link
              key={m}
              href={`${pathname}?month=${i + 1}&year=${activeDate.year}${
                type ? `&${type}=${value}` : ''
              }`}
            >
              <DropdownMenuCheckboxItem
                key={m}
                checked={activeDate.month === i + 1}
                onCheckedChange={() =>
                  renderActiveDate(i + 1, activeDate.year as number)
                }
              >
                {m}
              </DropdownMenuCheckboxItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center gap-2">
        <Input
          value={activeDate.year}
          onChange={renderActiveYear}
          placeholder="Enter year"
          className="rounded-none"
        />
        <Button onClick={renderSubmitReportYear}>Submit</Button>
      </div>
    </div>
  );
}

// /admin/account-report?acc=${name}
