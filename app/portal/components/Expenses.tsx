'use client';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react';
import { notify, toastConfirmAction } from '@/app/utils/toast';

import handleRegisterExpenses from '../actions/handleRegisterExpenses';
import { toast } from 'sonner';
import {
  formateInputAmount,
  removeCommaAmount,
} from '@/app/utils/formatAmount';
export default function Expenses({
  savedExpenses,
  workerId,
}: {
  workerId: string;
  savedExpenses: Array<{ id: number; amount: string; expense: string }>;
}) {
  const inputIdRef = useRef(0);
  const [expenses, setExpenses] =
    useState<Array<{ expense: string; amount: string; id: number }>>(
      savedExpenses
    );

  function addMoreExpenses() {
    setExpenses([
      ...expenses,
      {
        id: savedExpenses.slice(-1)[0]?.id + 1 || inputIdRef.current++,
        expense: '',
        amount: '',
      },
    ]);
  }

  const handleClickOutside = useCallback(
    (e: CustomEvent<{ originalEvent: PointerEvent | FocusEvent }>) => {
      const targetNode = document.querySelector('.toaster');

      if (
        e.target &&
        targetNode &&
        targetNode?.contains(e.target as HTMLElement)
      ) {
        e.preventDefault();
      }
    },
    []
  );

  function updateExpenses(
    e: ChangeEvent<HTMLInputElement>,
    type: string,
    id: number
  ) {
    const expense = expenses.map((expense) => {
      if (expense.id === id) {
        return {
          ...expense,
          amount:
            type === 'amount'
              ? formateInputAmount(e.target.value)
              : expense.amount,
          expense: type === 'expense' ? e.target.value : expense.expense,
        };
      }
      return expense;
    });
    setExpenses(expense);
  }

  const [openExpensesModal, setExpensesModal] = useState(false);
  async function renderSubmitExpenses(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const filterExpenses = expenses
      .filter(
        (expense) =>
          (removeCommaAmount(String(expense.amount)) || 0) > 0 &&
          expense.expense.length > 0
      )
      .map((expense) => {
        return {
          ...expense,
          amount: removeCommaAmount(String(expense.amount)),
        };
      });

    toast.dismiss('confirm');
    toast.loading('registering', { id: 'expenses', position: 'top-right' });
    const response = await handleRegisterExpenses(filterExpenses, workerId);
    if (response.code === 200) setExpensesModal(false);
    return notify(response.message, 'expenses', response.code);
  }
  return (
    <Dialog open={openExpensesModal} onOpenChange={setExpensesModal}>
      <DialogTrigger className="relative -top-4" asChild>
        <Button variant="outline">Expenses</Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={handleClickOutside}
        onInteractOutside={handleClickOutside}
      >
        <DialogHeader>
          <DialogTitle>Expenses</DialogTitle>
          <DialogDescription>
            To be filled at the end of your shift (it can't be edited)
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {expenses.map((_, id) => (
            <div key={id} className="flex gap-3">
              <Input
                title="Enter a valid expense"
                placeholder="Expense"
                value={expenses[id].expense}
                type="text"
                onChange={(e) => updateExpenses(e, 'expense', id)}
              />
              <Input
                placeholder="amount"
                value={formateInputAmount(expenses[id].amount)}
                type="text"
                onChange={(e) => updateExpenses(e, 'amount', id)}
              />
            </div>
          ))}
          <Button
            type="button"
            disabled={expenses.length >= 4}
            onClick={expenses.length <= 4 ? addMoreExpenses : undefined}
            variant="outline"
          >
            Add
          </Button>
          <DialogFooter>
            <Button
              onClick={() =>
                toastConfirmAction('Register expense', renderSubmitExpenses)
              }
              disabled={
                expenses.length <= 0 ||
                +(expenses?.[0]?.amount ?? 0) <= 0 ||
                expenses?.[0]?.expense.length <= 0
              }
            >
              Submit
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
