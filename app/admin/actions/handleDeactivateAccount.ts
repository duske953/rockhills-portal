'use server';
import sendResponse from '@/app/utils/sendResponse';
import tryCatchWrapper from '@/app/utils/tryCatchWrapper';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const handleDeactivateAccount = tryCatchWrapper(async (id: string) => {
  await prisma.account.update({ where: { id }, data: { deactivate: true } });
  revalidatePath('/admin/portal/deactivate-account');
  return sendResponse('Account deactivated', 200);
});

export default handleDeactivateAccount;
