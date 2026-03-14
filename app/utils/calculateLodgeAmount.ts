import prisma from '@/lib/prisma';
import { calculateApprovedAmount } from './calculateApprovedAmount';

export async function calculateLodgeAmount(id: string) {
  const lodgeAmount = await prisma.customers.groupBy({
    _sum: {
      amount: true,
    },
    by: ['paymentType'],
    where: {
      workerId: id,
    },
  });
  const doc = await prisma.worker.update({
    where: { id },
    data: {
      lodgeAmount,
    },
  });
  const approvedAmount = calculateApprovedAmount(
    doc.expenses as any,
    doc.lodgeAmount as any,
    doc.drinkSales as any,
  );
  await prisma.worker.update({
    where: { id },
    data: {
      approvedAmount,
    },
  });
}
