'use server';

import revalidate from '@/app/utils/revalidate';
import sendResponse from '@/app/utils/sendResponse';
import tryCatchWrapper from '@/app/utils/tryCatchWrapper';
import prisma from '@/lib/prisma';

const handleApproveAccountReport = tryCatchWrapper(async (id: string) => {
  const worker = await prisma.worker.findFirst({ where: { id } });
  if (!worker)
    return sendResponse('Something went wrong with this report', 400);
  await prisma.worker.update({
    where: { id },
    data: {
      approved: !worker.approved,
    },
  });
  revalidate('/admin/portal/account-report');
  return sendResponse('Account Approved', 200);
});

export default handleApproveAccountReport;
