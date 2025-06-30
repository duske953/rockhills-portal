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
import { FormEvent, useState } from 'react';
import { notify, toastConfirmAction } from '@/app/utils/toast';
import handleRegisterDrinkSales from '../actions/handleRegisterDrinkSales';

import { toast } from 'sonner';
import {
  formateInputAmount,
  removeCommaAmount,
} from '@/app/utils/formatAmount';

const MIN_DRINK_AMOUNT = 500;
export default function DrinkSales({
  savedDrinkSales,
  workerId,
}: {
  savedDrinkSales: { cash: string; pos: string };
  workerId: string;
}) {
  const [openDrinkSalesModal, setOpenDrinkSalesModal] = useState(false);
  const [drinkSales, setDrinkSales] = useState(
    savedDrinkSales || { cash: '', pos: '' }
  );
  const formatCashAmount = removeCommaAmount(drinkSales.cash);
  const formatPosAmount = removeCommaAmount(drinkSales.pos);
  async function renderSubmitDrinkSales(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      formatPosAmount < MIN_DRINK_AMOUNT &&
      formatCashAmount < MIN_DRINK_AMOUNT
    )
      return;
    toast.dismiss('confirm');
    toast.loading('registering', { id: 'drink-sales', position: 'top-right' });
    const response = await handleRegisterDrinkSales(
      {
        cash: formatCashAmount,
        pos: formatPosAmount,
      },
      workerId
    );

    if (response.code === 200) setOpenDrinkSalesModal(false);
    return notify(response.message, 'drink-sales', response.code);
  }
  const formatInputAmount = (type: string, ...num: Array<any>) => {
    setDrinkSales((prev) => {
      return {
        ...prev,
        [type]: formateInputAmount(num),
      };
    });
  };

  return (
    <Dialog open={openDrinkSalesModal} onOpenChange={setOpenDrinkSalesModal}>
      <DialogTrigger className="relative -top-4" asChild>
        <Button variant="outline">Drinks</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Drink Sales</DialogTitle>
          <DialogDescription>
            To be filled at the end of your shift (it can't be edited)
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Input
            value={drinkSales.cash}
            onChange={(e) => formatInputAmount('cash', e.target.value)}
            placeholder="Total cash salses"
            type="text"
          />
          <Input
            value={drinkSales.pos}
            onChange={(e) => formatInputAmount('pos', e.target.value)}
            placeholder="Total pos sales"
            type="text"
          />

          <DialogFooter>
            <Button
              onClick={() =>
                toastConfirmAction('Register drinks', renderSubmitDrinkSales)
              }
              type="button"
              disabled={
                formatCashAmount < MIN_DRINK_AMOUNT &&
                formatPosAmount < MIN_DRINK_AMOUNT
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
