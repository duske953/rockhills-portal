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
import Link from 'next/link';

export default function AccountDropdown({
  accounts,
}: {
  accounts: Array<{ name: string }>;
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
          <>
            <DropdownMenuItem className="" key={acc.name}>
              <Link
                className="w-full h-full"
                href={`/admin/account-report?acc=${acc.name}`}
              >
                {acc.name}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
