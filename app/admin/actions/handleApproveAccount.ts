'use server';
import revalidate from '@/app/utils/revalidate';
import sendResponse from '@/app/utils/sendResponse';
import tryCatchWrapper from '@/app/utils/tryCatchWrapper';
import prisma from '@/lib/prisma';

const handleApproveAccount = tryCatchWrapper(
  async (id: string, active: boolean) => {
    const account = await prisma.account.update({
      where: { id },
      data: {
        active: !active,
      },
    });
    if (!account) return sendResponse('Something went wrong', 400);
    revalidate('/admin/portal/approve-account');
    return sendResponse('Operation successful', 200);
  }
);

export default handleApproveAccount;
