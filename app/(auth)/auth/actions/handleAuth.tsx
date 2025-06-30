'use server';
import { sendCookies } from '@/app/utils/cookies';
import sendResponse from '@/app/utils/sendResponse';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import moment from 'moment';

const CHECK_IN_TIME = moment({ hour: 8, minute: 45 });
const SALT_ROUNDS = 10;
async function hashPassword(password: string) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(plainPassword: string, hashedPassword: string) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

async function handleSignup(name: string, password: string) {
  try {
    await prisma.account.create({
      data: {
        name: name.toLowerCase(),
        password: await hashPassword(password),
      },
    });
    return sendResponse('Account created', 200);
  } catch (err: any) {
    if (err.name === 'PrismaClientKnownRequestError')
      return sendResponse('Account exists', 400);
    return sendResponse(err.message, 500);
  }
}

async function handleLogin(name: string, password: string, currDate: Date) {
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
  const hour = moment(currDate).get('hour');
  const minute = moment(currDate).get('minute');
  const currTime = moment({ hour, minute });
  const validLoginTime = moment(currTime).isAfter(CHECK_IN_TIME);
  console.log(currTime, CHECK_IN_TIME, validLoginTime);
  if (!isLoggedIn?.isActive && validLoginTime) {
    await prisma.worker.create({
      data: {
        name: name.toLowerCase(),
      },
    });
    return sendResponse('Logged In', 200);
  }

  if (!isLoggedIn?.isActive && !validLoginTime) {
    await sendCookies('temporary-login', user.name);
    return sendResponse(
      'Login is not yet open. You can access your account starting from 8:45 AM.',
      200
    );
  }
  if (
    isLoggedIn?.isActive &&
    isLoggedIn.name.toLowerCase() !== user.name.toLowerCase()
  ) {
    await sendCookies('temporary-login', user.name);
    return sendResponse('authenticated', 200);
  }
  return sendResponse('Logged In', 200);
}

export default async function handleAuth(
  name: string,
  password: string,
  type: string,
  currDate: Date
) {
  if (type === 'signup') return handleSignup(name, password);
  return handleLogin(name, password, currDate);
}
