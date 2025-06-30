'use server';

import sendResponse from '@/app/utils/sendResponse';
import tryCatchWrapper from '@/app/utils/tryCatchWrapper';
import prisma from '@/lib/prisma';

const handleDeregisterRoom = tryCatchWrapper(async (room: number) => {
  const bookedRoom = await prisma.rooms.findFirst({
    where: { room, booked: true },
  });
  if (!bookedRoom) return sendResponse('This room is not booked', 400);
  await prisma.rooms.update({
    where: {
      room,
    },
    data: {
      booked: false,
      checkInTime: null,
    },
  });
  return sendResponse(`Room ${room} has been deregistered`, 200);
});

export default handleDeregisterRoom;
