'use server';

import { sendCookies } from '@/app/utils/cookies';
import sendResponse from '@/app/utils/sendResponse';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export default async function handleAuthAdmin(password: string) {
  if (password !== ADMIN_PASSWORD) return sendResponse('Unauthorized', 401);
  await sendCookies('auth-admin', 'admin-authenticated');
  return sendResponse('Authenticated', 200);
}
