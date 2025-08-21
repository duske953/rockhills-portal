'use client';

import { buttonVariants } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';
import Link from 'next/link';

import Logout from '@/app/components/Logout';

export default function TemporaryLogin({ name }: { name: string }) {
  return (
    <>
      <section className="pb-10 max-sm:pt-16">
        <div className="max-w-4xl mx-auto px-3 py-4 text-center relative">
          <p className="py-8 text-3xl text-gray-600 font-bold">
            Welcome {name}
          </p>

          <div className="right-3 gap-5 flex justify-center">
            <Link
              className={cn(buttonVariants({ variant: 'outline' }))}
              href={`/portal/account-report?acc=${name}&month=${
                new Date().getMonth() + 1
              }&year=${new Date().getFullYear()}`}
            >
              Account Report
            </Link>
          </div>
        </div>
        <div className="absolute right-3 top-3 space-y-4">
          <Logout cookie="temporary-login" />
        </div>
      </section>
      <div className="flex justify-center pt-36">
        <p className="z-20 top-16 right-3 text-red-700 font-semibold uppercase">
          Ensure you logout when you're done
        </p>
      </div>
    </>
  );
}
