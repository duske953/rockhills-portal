'use server';
import { deleteCookie, sendCookies } from '@/app/utils/cookies';
import sendResponse from '@/app/utils/sendResponse';
import tryCatchWrapper from '@/app/utils/tryCatchWrapper';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import moment from 'moment';

const LOGIN_OPEN_HOUR = 9;
const SALT_ROUNDS = 10;
const MIN_REASON_LENGTH = 10;
const CHOOSE_DAY_CODE = 428;
async function hashPassword(password: string) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(plainPassword: string, hashedPassword: string) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

const handleSignup = tryCatchWrapper(async (name: string, password: string) => {
  await prisma.account.create({
    data: {
      name: name.toLowerCase(),
      password: await hashPassword(password),
    },
  });
  return sendResponse('Account created', 200);
});

const LOGIN_CLOSED_CODE = 423;

const handleLogin = tryCatchWrapper(
  async (
    name: string,
    password: string,
    currDate: Date,
    tzOffsetMinutes: number = 0,
    shiftDate?: string,
    reason?: string,
  ) => {
    const user = await prisma.account.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (!user) return sendResponse('unauthorized', 401);
    if (!(await comparePassword(password, user?.password)))
      return sendResponse('unauthorized', 401);
    if (!user.active) return sendResponse('Contact admin for approval', 401);
    const isLoggedIn = await prisma.worker.findFirst({
      where: { isActive: true },
    });
    // Evaluate the window in the receptionist's timezone, not the server's.
    // Open from 9:00 AM to midnight, so a shift started in the evening is
    // never closed out of its own day.
    const currTime = moment(currDate).utcOffset(-tzOffsetMinutes);
    const loginOpen = currTime.clone().startOf('day').hour(LOGIN_OPEN_HOUR);
    const validLoginTime = !currTime.isBefore(loginOpen);
    const closedMessage = 'Login opens at 9:00 AM.';
    // Their shift is still open, so they can log back in at any time
    if (
      isLoggedIn?.isActive &&
      isLoggedIn.name.toLowerCase() === user.name.toLowerCase()
    ) {
      await sendCookies('authenticated', user.name);
      await deleteCookie('temporary-login');
      return sendResponse('Logged In', 200);
    }

    // Only starting a new shift is restricted to the login window
    if (!validLoginTime) {
      await deleteCookie('authenticated');
      await sendCookies('temporary-login', user.name);
      return sendResponse(closedMessage, LOGIN_CLOSED_CODE);
    }

    if (isLoggedIn?.isActive) {
      await deleteCookie('authenticated');
      await sendCookies('temporary-login', user.name);
      return sendResponse('authenticated', 200);
    }

    // A forgotten shift can be filed on its real day instead of being folded
    // into today's takings. Only yesterday is ever offered.
    const today = currTime.format('YYYY-MM-DD');
    const previousDay = currTime.clone().subtract(1, 'day');
    const previousKey = previousDay.format('YYYY-MM-DD');
    const shiftOnPreviousDay = await prisma.worker.findFirst({
      where: {
        checkInTime: {
          gte: previousDay.clone().startOf('day').toDate(),
          lt: previousDay.clone().add(1, 'day').startOf('day').toDate(),
        },
      },
      select: { id: true },
    });
    const missingDay = shiftOnPreviousDay ? null : previousKey;

    if (!shiftDate && missingDay) {
      await deleteCookie('authenticated');
      return sendResponse(
        'Was the last shift recorded?',
        CHOOSE_DAY_CODE,
        { date: missingDay, today },
      );
    }

    const targetDay = shiftDate || today;
    const isLate = targetDay !== today;
    if (isLate && !missingDay)
      return sendResponse('That day already has a shift recorded', 400);
    if (isLate && targetDay !== missingDay)
      return sendResponse(
        'Only the most recent missing day can be recorded',
        400,
      );
    if (isLate && (!reason || reason.trim().length < MIN_REASON_LENGTH))
      return sendResponse(
        `Give a reason of at least ${MIN_REASON_LENGTH} characters for recording a past day`,
        400,
      );

    await prisma.worker.create({
      data: {
        name: name.toLowerCase(),
        checkInTime: isLate
          ? moment(targetDay, 'YYYY-MM-DD')
              .hour(LOGIN_OPEN_HOUR)
              .minute(0)
              .second(0)
              .millisecond(0)
              .toDate()
          : currTime.toDate(),
        openedAt: currTime.toDate(),
        lateRecord: isLate,
        reason: isLate ? reason?.trim() : null,
      },
    });
    await sendCookies('authenticated', user.name);
    await deleteCookie('temporary-login');
    return sendResponse('Logged In', 200);
  },
);

export default async function handleAuth(
  name: string,
  password: string,
  type: string,
  currDate: Date,
  tzOffsetMinutes = 0,
  shiftDate?: string,
  reason?: string,
) {
  if (type === 'signup') return handleSignup(name, password);
  return handleLogin(
    name,
    password,
    currDate,
    tzOffsetMinutes,
    shiftDate,
    reason,
  );
}
