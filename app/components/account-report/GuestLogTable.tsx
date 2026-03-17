'use client';
import { cn } from '@/app/lib/utils';
import { Phone } from 'lucide-react';
import { FaNairaSign } from 'react-icons/fa6';
import { formatAmount } from '@/app/utils/formatAmount';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import EditCustomer from '@/app/portal/EditCustomer';

const GuestLogTable = ({
  customers,
  type,
}: {
  customers: any[];
  type?: string;
}) => {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-0.5 w-6 bg-primary rounded-full" />
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
          Guest Log
        </h4>
      </div>
      <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-[10px] font-black uppercase text-slate-500">
                Guest
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-slate-500">
                Contact
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-slate-500 text-center">
                Room
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-slate-500">
                Payment
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-slate-500 text-right">
                Amount
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase text-slate-500 text-right opacity-0">
                -
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-50">
            {customers.map((customer: any) => (
              <TableRow
                key={customer.id}
                className="hover:bg-slate-50/50 transition-colors border-none"
              >
                <TableCell className="font-bold text-slate-800">
                  {customer.name}
                </TableCell>
                <TableCell className="text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <Phone size={10} className="text-primary/40" />
                    {customer.phoneNumber}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-black">
                    {customer.room}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span
                      className={cn(
                        'text-[9px] font-black px-1.5 py-0.5 rounded-md w-fit uppercase border',
                        customer.paymentType === 'CASH'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-blue-50 text-blue-600 border-blue-100',
                      )}
                    >
                      {customer.paymentType}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 pl-0.5 uppercase tracking-tighter italic">
                      {customer.stayType}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-black text-slate-800 tabular-nums">
                  <div className="flex items-center justify-end gap-0.5">
                    <FaNairaSign size={10} className="text-primary" />
                    {formatAmount(customer.amount)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {type === 'worker' && !customer.edit && (
                    <EditCustomer
                      id={customer.id}
                      workerId={customer.workerId}
                      room={customer.room as unknown as number}
                      amount={customer.amount as unknown as string}
                      stay={customer.stayType}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GuestLogTable;
