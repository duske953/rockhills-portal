import prisma from '@/lib/prisma';

export async function isWorkerAuthenticated() {
  const worker = await prisma.worker.findFirst({
    where: { isActive: true, approved: false },
  });
  return worker;
}

export async function isAccountAuthenticated(name: string) {
  const activeAccount = await prisma.account.findFirst({
    where: {
      name: { equals: name, mode: 'insensitive' },
      deactivate: false,
      active: true,
    },
  });
  return activeAccount;
}
