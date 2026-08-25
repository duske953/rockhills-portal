import { redirect } from 'next/navigation';
import { getCookies } from '../utils/cookies';
import InputAdminPassword from './components/InputAdminPassword';

export default async function Page() {
  if (await getCookies('auth-admin')) redirect('/admin/portal');
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Admin Access
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Enter the admin password to continue.
          </p>
        </div>
        <InputAdminPassword />
      </div>
    </div>
  );
}
