import Link from 'next/link';
import {
  BarChart3,
  Fingerprint,
  ShieldCheck,
  ArrowRight,
  Zap,
} from 'lucide-react';

export default async function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 selection:bg-indigo-100">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Zap size={14} className="text-indigo-600 fill-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
              The Fleet Standard
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9]">
            RockHills
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Portfolio
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed">
            Elevating hospitality management with real-time executive analytics,
            consolidated shift auditing, and intelligent guest loyalty tracking.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
            <Link
              href="/portal"
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20 flex items-center gap-3 group"
            >
              Enterprise Portal
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/admin/portal"
              className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all flex items-center gap-3"
            >
              Executive Admin
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BarChart3 className="text-indigo-600" />}
            title="Executive Insights"
            description="Visualize revenue velocity, net performance, and operational growth with standard-compliant reporting."
          />
          <FeatureCard
            icon={<Fingerprint className="text-rose-600" />}
            title="Guest Loyalty"
            description="Identify and recognize 'Star Guests' through advanced patronage frequency tracking and normalization."
          />
          <FeatureCard
            icon={<ShieldCheck className="text-emerald-600" />}
            title="Certified Audits"
            description="Standardized shift pulse monitoring ensures every session revenue is certified and audited."
          />
        </div>

        {/* Footer Link */}
        <div className="mt-24 text-center">
          <Link
            href="/auth/login"
            className="text-slate-400 hover:text-indigo-600 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            System Secure Login
            <ShieldCheck size={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] hover:bg-white transition-all duration-500 group shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2">
      <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">
        {description}
      </p>
    </div>
  );
}
