'use client';
import { Input } from '@/app/components/ui/input';
import { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import handleAuth from '../auth/actions/handleAuth';
import { useRouter } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { buttonVariants } from '@/app/components/ui/button';
import BtnLoader from '@/app/components/BtnLoader';
import useLoadingBtn from '@/app/hooks/useLoadingBtn';
import { notify } from '@/app/utils/toast';

export default function FormCredentials({
  type,
  action,
}: {
  type: string;
  action: string;
}) {
  const [credentials, setCredentials] = useState({
    name: '',
    password: '',
  });
  const router = useRouter();
  const { loading, setLoading } = useLoadingBtn();
  function renderOnChange(e: ChangeEvent<HTMLInputElement>, type: string) {
    if (type === 'name') {
      setCredentials((prev) => {
        return {
          ...prev,
          name: e.target.value,
        };
      });
      return;
    }
    setCredentials((prev) => {
      return {
        ...prev,
        password: e.target.value,
      };
    });
  }

  async function renderSubmitCredentials(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!credentials.name || !credentials.password) return;
    setLoading(true);
    const response = await handleAuth(
      credentials.name,
      credentials.password,
      type,
      new Date()
    );
    setLoading(false);
    if (response.code === 200) {
      setCredentials(() => {
        return {
          name: '',
          password: '',
        };
      });
      if (type === 'login') router.replace('/portal');
    }
    return notify(response?.message, 'auth', response.code);
  }
  return (
    <form
      onSubmit={renderSubmitCredentials}
      className="max-w-xl mx-auto px-4 py-10 max-sm:py-16 relative"
    >
      <h1 className="font-bold uppercase text-gray-800 text-4xl mb-7 text-center max-sm:text-3xl">
        {action}
      </h1>
      <div className="flex flex-col gap-5">
        <Input
          value={credentials.name}
          onChange={(e) => renderOnChange(e, 'name')}
          type="text"
          placeholder="Name"
        />
        <Input
          value={credentials.password}
          onChange={(e) => renderOnChange(e, 'password')}
          type="password"
          placeholder="Password"
        />
        <BtnLoader
          disabled={!credentials.name || !credentials.password || loading}
          loading={loading}
        />
      </div>
      <Link
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'absolute right-3 top-2'
        )}
        href={`/auth/${type === 'signup' ? 'login' : 'signup'}`}
      >
        {type === 'signup' ? 'Login' : 'Signup'}
      </Link>
    </form>
  );
}
