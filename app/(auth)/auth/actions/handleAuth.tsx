'use server';
import { deleteCookie, sendCookies } from '@/app/utils/cookies';
import sendResponse from '@/app/utils/sendResponse';
import tryCatchWrapper from '@/app/utils/tryCatchWrapper';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import moment from 'moment';

const LOGIN_OPEN_HOUR = 9;
const LOGIN_CLOSE_HOUR = 18;
const SALT_ROUNDS = 10;
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

const handleLogin = tryCatchWrapper(
  async (name: string, password: string, currDate: Date) => {
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
    const currTime = moment(currDate);
    const loginOpen = currTime
      .hour(LOGIN_OPEN_HOUR)
      .minute(0)
      .second(0)
      .millisecond(0);
    const loginClose = currTime
      .clone()
      .hour(LOGIN_CLOSE_HOUR)
      .minute(0)
      .second(0)
      .millisecond(0);
    const validLoginTime =
      currTime.isSameOrAfter(loginOpen) && currTime.isBefore(loginClose);
    const closedMessage = currTime.isBefore(loginOpen)
      ? 'Login opens at 9:00 AM.'
      : 'Login is closed for today. It reopens at 9:00 AM tomorrow.';
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
      return sendResponse(closedMessage, 200);
    }

    if (isLoggedIn?.isActive) {
      await deleteCookie('authenticated');
      await sendCookies('temporary-login', user.name);
      return sendResponse('authenticated', 200);
    }

    await prisma.worker.create({
      data: {
        name: name.toLowerCase(),
      },
    });
    await sendCookies('authenticated', user.name);
    await deleteCookie('temporary-login');
    return sendResponse('Logged In', 200);
  }
);

export default async function handleAuth(
  name: string,
  password: string,
  type: string,
  currDate: Date
) {
  if (type === 'signup') return handleSignup(name, password);
  return handleLogin(name, password, currDate);
}
