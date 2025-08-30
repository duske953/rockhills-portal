'use server';

import { calculateLodgeAmount } from '@/app/utils/calculateLodgeAmount';
import { isAccountAuthenticated } from '@/app/utils/isAutenticated';
import revalidate from '@/app/utils/revalidate';
import sendResponse from '@/app/utils/sendResponse';
import tryCatchWrapper from '@/app/utils/tryCatchWrapper';
import prisma from '@/lib/prisma';

const handleEditCustomer = tryCatchWrapper(
  async (
    id: string,
    workerId: string,
    oldRoom: number,
    room: number,
    amount: number,
    stayType: string
  ) => {
    const isRoomBooked = await prisma.rooms.findFirst({
      where: { room, booked: true },
    });
    if (isRoomBooked) return sendResponse('Room is booked', 400);
    await prisma.rooms.update({
      where: { room: oldRoom },
      data: { booked: false },
    });

    await prisma.rooms.update({ where: { room }, data: { booked: true } });
    const worker = await prisma.worker.findFirst({ where: { id: workerId } });

    if (!worker || worker.approved) return sendResponse('Unauthorized', 401);
    const activeAccount = await isAccountAuthenticated(worker.name);
    if (!activeAccount) return sendResponse('Unauthorized', 401);
    await prisma.customers.update({
      where: { id },
      data: { room, amount: +amount, stayType, edit: true },
    });
    await calculateLodgeAmount(worker.id);

    revalidate('/portal/account-report');
    return sendResponse('Customer updated', 200);
  }
);

export default handleEditCustomer;
