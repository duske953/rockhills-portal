import prisma from '@/lib/prisma';
import AccountList from '../../components/AccountList';

export default async function Page() {
  const account = await prisma.account.findMany({});

  return (
    <div>
      {account.length === 0 && (
        <p className="text-3xl">You have no pending account(s)</p>
      )}
      <ul className="flex flex-col gap-12">
        {account.map((acc) => (
          <AccountList
            action="approve-account"
            key={acc.id}
            acc={acc}
            type={acc.active ? 'Reject' : 'Approve'}
          />
        ))}
      </ul>
    </div>
  );
}
