'use server';
import { deleteCookie } from './cookies';
import sendResponse from './sendResponse';
import tryCatchWrapper from './tryCatchWrapper';

const handleLogout = tryCatchWrapper(async (name: string) => {
  await deleteCookie(name);
  return sendResponse('Logged out', 200);
});

export default handleLogout;
