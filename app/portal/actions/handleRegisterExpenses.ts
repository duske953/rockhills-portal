'use server';
import { calculateApprovedAmount } from '@/app/utils/calculateApprovedAmount';
import revalidate from '@/app/utils/revalidate';
import sendResponse from '@/app/utils/sendResponse';
import tryCatchWrapper from '@/app/utils/tryCatchWrapper';
import prisma from '@/lib/prisma';

const handleRegisterExpenses = tryCatchWrapper(
  async (
    expenses: Array<{
      id: number;
      expense: string;
      amount: number | undefined;
    }>,
    workerId: string
  ) => {
    try {
      const activeWorker = await prisma.worker.findFirst({
        where: { approved: false, id: workerId },
      });

      if (!activeWorker) return sendResponse('Unauthorized', 401);
      const totalExpenses = expenses.reduce((acc, expense) => {
        return acc + +expense.amount!;
      }, 0);
      const totalLodgeCash = activeWorker.lodgeAmount.find(
        (lodge: any) => lodge?.paymentType === 'CASH'
      ) as { _sum: { amount: number } } | undefined;
      const drinkSales = activeWorker.drinkSales as
        | { cash?: number }
        | undefined;
      if (!totalLodgeCash && !drinkSales?.cash)
        return sendResponse('Cash not availabe for this transaction', 400);
      if (
        totalExpenses >
        (totalLodgeCash?._sum.amount || 0) + (drinkSales?.cash || 0)
      )
        return sendResponse('Cash not availabe for this transaction', 400);
      if (!activeWorker) return sendResponse('Unauthorized', 401);
      const doc = await prisma.worker.update({
        where: { id: activeWorker.id },
        data: {
          expenses,
        },
      });

      const approvedAmount = calculateApprovedAmount(
        doc.expenses,
        doc.lodgeAmount,
        doc.drinkSales
      );
      await prisma.worker.update({
        where: { id: activeWorker.id },
        data: { approvedAmount },
      });
      revalidate('/portal/account-report');
      return sendResponse('Approved', 200);
    } catch (err) {
      return sendResponse('something went wrong', 500);
    }
  }
);

export default handleRegisterExpenses;
