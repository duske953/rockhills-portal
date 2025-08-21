import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Input } from '@/app/components/ui/input';
import moment from 'moment';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

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

export default function AccountReportActions({
  currAccountReport,
  setCurrAccountReport,
  name,
}) {
  const [sortApproved, setSortApproved] = useState('');
  const searchParams = useSearchParams();
  const [activeDate, setActiveDate] = useState({
    month: Number(searchParams.get('month')) || moment().get('month') + 1,
    year: moment().get('year'),
  });
  function renderSortByApproved(status: string) {
    setSortApproved(status);
    setCurrAccountReport(
      currAccountReport.toSorted(
        (a: { approved: boolean }, b: { approved: boolean }): number => {
          return status === 'approved'
            ? (b.approved ? 1 : 0) - (a.approved ? 1 : 0)
            : (a.approved ? 1 : 0) - (b.approved ? 1 : 0);
        }
      )
    );
  }

  function renderActiveDate(month: number, year: number) {
    setActiveDate({ month, year });
  }

  return (
    <div className="flex items-center justify-between max-sm:flex-col gap-6 max-sm:items-start">
      <div>
        <p className="mb-3">Sort By</p>
        <div className="flex gap-3 items-center relative z-[500]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Approved</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Approved Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortApproved === 'approved'}
                onCheckedChange={() => renderSortByApproved('approved')}
              >
                Approved
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortApproved === 'pending'}
                onCheckedChange={() => renderSortByApproved('pending')}
              >
                Pending
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="">
        <p className="mb-3">Filter by</p>
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
                  href={`/admin/account-report?acc=${name}&month=${
                    i + 1
                  }&year=${activeDate.year}`}
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
      </div>
    </div>
  );
}
