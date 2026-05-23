import prisma from '@/lib/prisma';
import AccountList from '../../components/AccountList';
export default async function Page() {
  const account = await prisma.account.findMany();
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
      <div className="border-b border-slate-100 pb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Personnel <span className="text-slate-500 font-medium">Deactivation</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">
          Manage system access and deactivate personnel accounts as required.
        </p>
      </div>

      <div className="space-y-4">
        {account.length === 0 ? (
          <div className="bg-slate-50 rounded-xl p-12 text-center border border-slate-100">
            <p className="text-slate-400 font-medium">No subscribed accounts found.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3 items-center">
            {account.map((acc) => (
              <AccountList
                key={acc.name}
                acc={acc}
                action="delete-account"
                type={acc.deactivate ? 'Reinstate' : 'Deactivate'}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
