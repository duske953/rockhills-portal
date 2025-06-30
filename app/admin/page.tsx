import { redirect } from 'next/navigation';
import { getCookies } from '../utils/cookies';
import InputAdminPassword from './components/InputAdminPassword';

export default async function Page() {
  if (await getCookies('auth-admin')) redirect('/admin/portal');
  return (
    <section className="py-20">
      <div className="max-w-xl mx-auto px-6">
        <h1 className="mb-7 text-center">Enter Admin Password</h1>
        <InputAdminPassword />
      </div>
    </section>
  );
}
