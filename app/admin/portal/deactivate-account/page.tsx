import prisma from '@/lib/prisma';
import AccountList from '../../components/AccountList';
export default async function Page() {
  const account = await prisma.account.findMany();
  return (
    <div>
      {account.length === 0 && (
        <p className="text-3xl">You have no subscribed account(s)</p>
      )}
      <ul className="flex flex-col gap-10 items-center">
        {account.map((acc) => (
          <AccountList
            key={acc.name}
            acc={acc}
            action="delete-account"
            type={acc.deactivate ? 'Reinstate' : 'Deactivate'}
          />
        ))}
      </ul>
    </div>
  );
}
