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
import { useState } from 'react';
import moment from 'moment';
import { usePathname, useSearchParams } from 'next/navigation';
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
  const [activeDate, setActiveDate] = useState({
    month: Number(searchParams.get('month')) || moment().get('month') + 1,
    year: moment().get('year'),
  });
  function renderActiveDate(month: number, year: number) {
    setActiveDate({ month, year });
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
                  renderActiveDate(i + 1, moment().get('year'))
                }
              >
                {m}
              </DropdownMenuCheckboxItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Input placeholder="Enter year" className="rounded-none" />
    </div>
  );
}

// /admin/account-report?acc=${name}
