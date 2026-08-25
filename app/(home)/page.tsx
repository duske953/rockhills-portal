import Link from 'next/link';

export default async function Page() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-md mx-auto px-6 flex flex-col items-center justify-center min-h-screen">
        <div className="space-y-12 text-center w-full">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              RockHills
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Hotel Management Portal
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/portal"
              className="block w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold tracking-wide hover:bg-slate-800 transition-colors text-center"
            >
              Receptionist
            </Link>
            <Link
              href="/admin/portal"
              className="block w-full py-3 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold tracking-wide hover:bg-slate-50 transition-colors text-center"
            >
              Admin
            </Link>
          </div>

          <Link
            href="/auth/login"
            className="block text-slate-300 hover:text-slate-500 text-xs font-medium tracking-wide transition-colors"
          >
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}
