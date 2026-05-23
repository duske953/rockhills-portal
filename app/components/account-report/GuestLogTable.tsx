'use client';

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
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-2">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Guest Log
        </h4>
        <div className="h-px flex-1 bg-slate-100" />
      </div>
      <div className="rounded-xl border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-10">
                Guest
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-10">
                Contact
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 text-center h-10">
                Room
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-10">
                Payment
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 text-right h-10">
                Amount
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 text-right opacity-0 h-10">
                -
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-50">
            {customers.map((customer: any) => (
              <TableRow
                key={customer.id}
                className="hover:bg-slate-50/30 transition-colors border-none"
              >
                <TableCell className="font-semibold text-slate-900 py-3">
                  {customer.name}
                </TableCell>
                <TableCell className="text-xs text-slate-500 py-3">
                  {customer.phoneNumber}
                </TableCell>
                <TableCell className="text-center py-3">
                  <span className="text-slate-600 text-xs font-bold">
                    {customer.room}
                  </span>
                </TableCell>
                <TableCell py-3>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-700 uppercase">
                      {customer.paymentType}
                    </span>
                    <span className="text-[8px] text-slate-400 uppercase font-medium">
                      {customer.stayType}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold text-slate-900 tabular-nums py-3">
                  <div className="flex items-center justify-end gap-0.5">
                    <FaNairaSign size={10} className="text-slate-300" />
                    {formatAmount(customer.amount)}
                  </div>
                </TableCell>
                <TableCell className="text-right py-3">
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
