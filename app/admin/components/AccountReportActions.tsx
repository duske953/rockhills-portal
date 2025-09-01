import AccountDateFilter from '@/app/components/AccountDateFilter';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

import { useState } from 'react';

interface AccountReport {
  approved: boolean;
  [key: string]: any;
}

export default function AccountReportActions({
  currAccountReport,
  setCurrAccountReport,
  name,
}: {
  currAccountReport: AccountReport[];
  setCurrAccountReport: (reports: AccountReport[]) => void;
  name: string;
}) {
  const [sortApproved, setSortApproved] = useState('');

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
        <AccountDateFilter type="acc" value={name} />
      </div>
    </div>
  );
}
