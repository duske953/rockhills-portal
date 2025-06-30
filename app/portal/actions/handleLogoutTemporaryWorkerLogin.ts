'use server';

import { deleteCookie } from '@/app/utils/cookies';
import revalidate from '@/app/utils/revalidate';
import sendResponse from '@/app/utils/sendResponse';
import tryCatchWrapper from '@/app/utils/tryCatchWrapper';

const handleLogoutTemoraryWorkerLogin = tryCatchWrapper(async () => {
  await deleteCookie('temporary-login');
  revalidate('/portal');
  return sendResponse('Logged out', 200);
});

export default handleLogoutTemoraryWorkerLogin;
