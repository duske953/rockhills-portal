'use server';
import { calculateLodgeAmount } from '@/app/utils/calculateLodgeAmount';
import {
  isAccountAuthenticated,
  isWorkerAuthenticated,
} from '@/app/utils/isAutenticated';
import sendResponse from '@/app/utils/sendResponse';
import tryCatchWrapper from '@/app/utils/tryCatchWrapper';
import prisma from '@/lib/prisma';

const handleRegisterCustomer = tryCatchWrapper(
  async (data: {
    room: number;
    name: string;
    amount: number;
    phoneNumber: string;
    stayType: string;
    paymentType: string;
    checkInTime: string;
  }) => {
    const room = await prisma.rooms.findFirst({ where: { room: data.room } });
    if (!room) return sendResponse('This room does not exist', 400);
    if (room.booked) return sendResponse('Room is booked', 400);
    const worker = await isWorkerAuthenticated();
    if (!worker || worker.approved) return sendResponse('Unauthorized', 401);
    const activeAccount = await isAccountAuthenticated(worker.name);
    if (!activeAccount) return sendResponse('Unauthorized', 401);

    await prisma.customers.create({
      data: { ...data, worker: { connect: { id: worker?.id } } },
    });
    await prisma.rooms.update({
      where: { room: data.room },
      data: {
        booked: true,
        checkInTime: new Date(),
      },
    });

    await calculateLodgeAmount(worker.id);
    return sendResponse('Customer registered', 200);
  }
);

export default handleRegisterCustomer;
