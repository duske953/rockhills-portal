'use client';

import { Input } from '@/app/components/ui/input';

export default function ResetPasswordForm() {
  return (
    <form className="text-center">
      <p className="mb-9 font-semibold text-gray-700">
        Enter Admin password To Reset Password
      </p>
      <div className="flex flex-col gap-6">
        <Input placeholder="Name" />
        <Input placeholder="Admin Password" />
        <button>Submit</button>
      </div>
    </form>
  );
}
