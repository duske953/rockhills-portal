'use client';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { cn } from '@/app/lib/utils';
import Link from 'next/link';
import { Fragment } from 'react';

export default function AccountDropdown({
  accounts,
  activeAcc,
}: {
  accounts: Array<{ name: string }>;
  activeAcc: string | undefined;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Account Report</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-sm:w-64" align="center">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accounts.map((acc) => (
          <Fragment key={acc.name}>
            <DropdownMenuItem className="" key={acc.name}>
              <span
                className={cn(
                  acc.name.toLowerCase() === activeAcc?.toLowerCase() &&
                    'size-2 bg-green-700 rounded-full'
                )}
              ></span>
              <Link
                className="w-full h-full"
                href={`/admin/account-report?acc=${acc.name}`}
              >
                {acc.name}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
