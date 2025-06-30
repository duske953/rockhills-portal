'use server';

import calculateApprovedAmount from '@/app/utils/calculateApprovedAmount';
import { isAccountAuthenticated } from '@/app/utils/isAutenticated';
import revalidate from '@/app/utils/revalidate';
import sendResponse from '@/app/utils/sendResponse';
import tryCatchWrapper from '@/app/utils/tryCatchWrapper';
import prisma from '@/lib/prisma';

const handleRegisterDrinkSales = tryCatchWrapper(
  async (drinkSales: { pos: number; cash: number }, workerId: string) => {
    const activeWorker = await prisma.worker.findFirst({
      where: { approved: false, id: workerId, isActive: true },
    });
    if (!activeWorker) return sendResponse('Unauthorized', 401);
    const activeAccount = await isAccountAuthenticated(activeWorker?.name);
    if (!activeAccount) return sendResponse('Unauthorized', 401);

    if (drinkSales.cash < 500 && drinkSales.pos < 500)
      return sendResponse("Total sales can't be less that the min(500)", 400);
    const doc = await prisma.worker.update({
      where: { id: activeWorker.id },
      data: {
        drinkSales,
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
    return sendResponse('Registered', 200);
  }
);

export default handleRegisterDrinkSales;
