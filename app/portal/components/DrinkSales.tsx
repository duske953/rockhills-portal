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
import { Wine } from 'lucide-react';

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
    savedDrinkSales || { cash: '', pos: '' },
  );
  const formatCashAmount = removeCommaAmount(drinkSales.cash);
  const formatPosAmount = removeCommaAmount(drinkSales.pos);
  async function renderSubmitDrinkSales(e?: FormEvent<HTMLFormElement>) {
    if (e) e.preventDefault();
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
      workerId,
    );

    if (!response) return notify('Something went wrong', 'drink-sales', 500);
    if (response.code === 200) setOpenDrinkSalesModal(false);
    return notify(response.message, 'drink-sales', response.code);
  }
  const formatInputAmount = (type: string, value: string) => {
    setDrinkSales((prev) => {
      return {
        ...prev,
        [type]: formateInputAmount(value),
      };
    });
  };

  return (
    <Dialog open={openDrinkSalesModal} onOpenChange={setOpenDrinkSalesModal}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-10 rounded-xl border-amber-100 bg-amber-50/50 text-amber-700 hover:bg-amber-100 hover:border-amber-200 transition-all font-bold shadow-sm"
        >
          <Wine size={14} className="opacity-70" />
          Drinks
        </Button>
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
                toastConfirmAction('Register drinks', () => {
                  renderSubmitDrinkSales();
                })
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
