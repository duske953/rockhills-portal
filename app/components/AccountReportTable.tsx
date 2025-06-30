'use client';
import { ReactNode, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import moment from 'moment';
import { FaNairaSign } from 'react-icons/fa6';
import DatePicker from 'react-datepicker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

import 'react-datepicker/dist/react-datepicker.css';
import { Button } from './ui/button';
import { formatAmount } from '../utils/formatAmount';
import { cn } from '../lib/utils';
import ApproveAccountReport from '../admin/components/ApproveAccountReport';
import Expenses from '../portal/components/Expenses';
import DrinkSales from '../portal/components/DrinkSales';

export default function AccountReportTable({
  children,
  type,
  accountReport,
  name,
}: {
  children?: ReactNode;
  type?: string;
  name: string;
  accountReport: any;
}) {
  const [startDate, setStartDate] = useState(new Date());
  const [currAccountReport, setCurrAccountReport] = useState(accountReport);
  const [sortApproved, setSortApproved] = useState('');

  interface LodgeSale {
    paymentType: 'CASH' | 'POS';
    _sum: {
      amount: number;
    };
  }

  interface DrinkSales {
    cash?: number;
    pos?: number;
  }

  function calculateTotalCashSales(
    lodgeSales: LodgeSale[],
    drinkSales: DrinkSales
  ): { pos: number; cash: number } {
    const lodgeCash =
      lodgeSales.find((s) => s.paymentType === 'CASH')?._sum.amount || 0;

    const lodgePos =
      lodgeSales.find((s) => s.paymentType === 'POS')?._sum.amount || 0;
    const drinkCash = drinkSales?.cash || 0;
    const drinkPos = drinkSales?.pos || 0;

    return {
      pos: lodgePos + drinkPos,
      cash: lodgeCash + drinkCash,
    };
  }

  function formatDate(date: Date) {
    return moment(date).format('MMMM Do YYYY');
  }

  function renderChangeDate(targetDate: Date | null) {
    if (!targetDate) return 0;
    setStartDate(targetDate);
    setCurrAccountReport(
      currAccountReport.toSorted(
        (a: { checkInTime: Date }, b: { checkInTime: Date }) => {
          if (
            formatDate(a.checkInTime) === formatDate(targetDate) &&
            formatDate(b.checkInTime) !== formatDate(targetDate)
          )
            return -1;
          if (
            formatDate(b.checkInTime) === formatDate(targetDate) &&
            formatDate(a.checkInTime) !== formatDate(targetDate)
          )
            return 1;
          return -1;
        }
      )
    );
  }

  function objectToArrObj(obj: any) {
    if (!obj) return [];
    const result = Object.entries(obj)?.map(([key, value]) => {
      return { amount: value, method: [key] };
    }) as Array<{ amount: number; method: string[] }>;
    return result.filter((res) => res.amount > 0);
  }

  useMemo(() => {
    setCurrAccountReport(accountReport);
  }, [accountReport]);

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
    <section className="relative">
      {children}
      <div className="">
        <p className="mb-3">Sort By</p>
        <div className="flex gap-3 items-center">
          <DatePicker
            customInput={
              <Button variant="outline">{formatDate(startDate)}</Button>
            }
            maxDate={accountReport[0].checkInTime}
            selected={startDate}
            onChange={renderChangeDate}
          />

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
        <h1 className="text-gray-700 font-bold text-4xl mb-8">
          {name}'s Summary
        </h1>

        <section className="flex flex-col relative gap-3">
          {currAccountReport.map((report: any) => (
            <section
              key={report.id}
              className="relative last:border-b-4 border-t-4 border-gray-500"
            >
              <p className="text-center py-10 max-sm:py-16 font-bold">
                {moment(report.checkInTime).format('MMMM Do, YYYY')}
              </p>

              <div className="relative z-10">
                {type === 'worker' && report.expenses.length <= 0 && (
                  <Expenses
                    savedExpenses={report.expenses}
                    workerId={report.id}
                  />
                )}
                {type === 'worker' &&
                  !report.drinkSales?.pos &&
                  !report.drinkSales?.cash && (
                    <DrinkSales
                      savedDrinkSales={report.drinkSales}
                      workerId={report.id}
                    />
                  )}
              </div>

              <div className=" gap-2 flex justify-end flex-col right-0 items-end relative -top-10">
                <div className="relative -top-12">
                  {type === 'worker' ? (
                    <p
                      className={cn(
                        'right-0 font-semibold max-sm:right-3 ml-auto',
                        report.approved ? 'text-green-700' : 'text-red-700'
                      )}
                    >
                      {report.approved ? 'Approved' : 'Pending'}
                    </p>
                  ) : (
                    <ApproveAccountReport
                      id={report.id}
                      approved={report.approved}
                    />
                  )}
                </div>
                {report.approvedAmount?.totalPos > 0 && (
                  <p className="flex items-center text-gray-700">
                    <span className="mr-3 uppercase font-bold w-36">
                      Pos Balance:
                    </span>
                    <FaNairaSign />
                    <span>{formatAmount(report.approvedAmount.totalPos)}</span>
                  </p>
                )}

                {report.approvedAmount?.totalCash > 0 && (
                  <p className="flex items-center text-gray-700">
                    <span className="mr-3 uppercase font-bold w-36">
                      Cash Balance:
                    </span>
                    <FaNairaSign />
                    <span>{formatAmount(report.approvedAmount.totalCash)}</span>
                  </p>
                )}
              </div>

              <Table className="relative">
                <TableCaption>
                  <div className="flex items-center flex-col gap-">
                    {report.lodgeAmount.map((lodge: any) => (
                      <div
                        key={lodge.paymentType}
                        className="flex items-center gap-2"
                      >
                        <p>
                          {lodge.paymentType === 'POS'
                            ? 'Accommodation/pos:'
                            : 'Accommodation/cash:'}
                        </p>

                        <p className="flex items-center">
                          <FaNairaSign />
                          {lodge._sum.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </TableCaption>

                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Stay</TableHead>
                    <TableHead>Check-In-Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="last:mt-9">
                  {report.customers.map(
                    (customer: {
                      id: string;
                      name: string;
                      phoneNumber: string;
                      room: string;
                      amount: number;
                      paymentType: string;
                      stayType: string;
                      checkInTime: string;
                    }) => (
                      <TableRow className="pb-9" key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.phoneNumber}</TableCell>
                        <TableCell>{customer.room}</TableCell>
                        <TableCell className="flex items-center">
                          <FaNairaSign />
                          {formatAmount(customer.amount)}
                        </TableCell>
                        <TableCell>{customer.paymentType}</TableCell>
                        <TableCell>{customer.stayType}</TableCell>
                        <TableCell>{customer.checkInTime}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>

              <div className="flex flex-col max-sm:gap-10 pb-8 w-full justify-start max-sm:py-10">
                <div className="self-end flex flex-col gap-3">
                  {calculateTotalCashSales(
                    report.lodgeAmount,
                    report.drinkSales
                  ).pos > 0 && (
                    <div className="flex items-center gap-3">
                      <p className="uppercase font-bold text-gray-700 w-40">
                        Total Pos Sales:
                      </p>
                      <p className="flex items-center">
                        <FaNairaSign />
                        {formatAmount(
                          calculateTotalCashSales(
                            report.lodgeAmount,
                            report.drinkSales
                          ).pos
                        )}
                      </p>
                    </div>
                  )}

                  {calculateTotalCashSales(
                    report.lodgeAmount,
                    report.drinkSales
                  )?.cash > 0 && (
                    <div className="flex items-center gap-3">
                      <p className="uppercase font-bold text-gray-700 w-40">
                        Total Cash Sales:
                      </p>
                      <p className="flex items-center">
                        <FaNairaSign />
                        {formatAmount(
                          calculateTotalCashSales(
                            report.lodgeAmount,
                            report.drinkSales
                          )?.cash
                        )}
                      </p>
                    </div>
                  )}
                </div>
                {report.expenses.length > 0 && (
                  <div>
                    <p className="uppercase font-semibold text-gray-700">
                      Expenses
                    </p>
                    <div className="flex-col mt-3 flex gap-3">
                      {report.expenses.map((expense: any) => (
                        <div key={expense.expense} className="flex gap-10">
                          <span className="w-28">{expense.expense}</span>
                          <span className="flex items-center">
                            <FaNairaSign />
                            {expense.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {objectToArrObj(report.drinkSales).length > 0 && (
                  <div className="-order-1">
                    <p className="uppercase font-semibold text-gray-700">
                      Drink Sales
                    </p>
                    <div className="mt-3 flex gap-3 flex-col">
                      {objectToArrObj(report.drinkSales).map((sales) => (
                        <p
                          key={sales.method as unknown as string}
                          className="flex gap-3"
                        >
                          <span className="w-28">Drink(s)/{sales.method}:</span>
                          <span className="flex items-center">
                            <FaNairaSign />
                            {formatAmount(sales.amount)}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          ))}
        </section>
      </div>
    </section>
  );
}
