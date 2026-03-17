'use client';
import { CreditCard, Wallet, Receipt } from 'lucide-react';
import { FaNairaSign } from 'react-icons/fa6';
import { formatAmount } from '@/app/utils/formatAmount';

interface RevenueStats {
  lodgePos: number;
  lodgeCash: number;
  drinkPos: number;
  drinkCash: number;
}

const RevenueBreakdown = ({ stats }: { stats: RevenueStats }) => {
  return (
    <div className="space-y-6">
      {/* Category Headers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accommodation Category */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
              Accommodation Revenue
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-indigo-50/30 rounded-3xl p-3 sm:p-6 border border-indigo-100/50 group hover:bg-white transition-all shadow-sm">
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <CreditCard size={10} /> Lodge POS
              </p>
              <p className="text-xl font-black text-indigo-900 tabular-nums flex items-center gap-1">
                <FaNairaSign className="text-sm opacity-60" />
                {formatAmount(stats.lodgePos)}
              </p>
            </div>
            <div className="bg-indigo-50/30 rounded-3xl p-3 sm:p-6 border border-indigo-100/50 group hover:bg-white transition-all shadow-sm">
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Wallet size={10} /> Lodge Cash
              </p>
              <p className="text-xl font-black text-indigo-900 tabular-nums flex items-center gap-1">
                <FaNairaSign className="text-sm opacity-60" />
                {formatAmount(stats.lodgeCash)}
              </p>
            </div>
          </div>
        </div>

        {/* Liquor Category */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-amber-500 rounded-full" />
            <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
              Liquor Sales
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-amber-50/30 rounded-3xl p-3 sm:p-6 border border-amber-100/50 group hover:bg-white transition-all shadow-sm">
              <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <CreditCard size={10} /> Drink POS
              </p>
              <p className="text-xl font-black text-amber-900 tabular-nums flex items-center gap-1">
                <FaNairaSign className="text-sm opacity-60" />
                {formatAmount(stats.drinkPos)}
              </p>
            </div>
            <div className="bg-amber-50/30 rounded-3xl p-3 sm:p-6 border border-amber-100/50 group hover:bg-white transition-all shadow-sm">
              <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Wallet size={10} /> Drink Cash
              </p>
              <p className="text-xl font-black text-amber-900 tabular-nums flex items-center gap-1">
                <FaNairaSign className="text-sm opacity-60" />
                {formatAmount(stats.drinkCash)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Net Summary Bar */}
      <div className="bg-slate-900 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between shadow-2xl shadow-slate-900/20 relative overflow-hidden group gap-4 sm:gap-6">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
          <Receipt size={140} />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
            Net Session Sales
          </p>
          <h2 className="text-4xl font-black text-white flex items-center gap-2 tabular-nums">
            <FaNairaSign className="text-2xl text-primary-foreground/90 font-bold" />
            {formatAmount(
              stats.lodgePos +
                stats.lodgeCash +
                stats.drinkPos +
                stats.drinkCash,
            )}
          </h2>
        </div>
        <div className="flex gap-4 relative z-10 w-full sm:w-auto">
          <div className="flex-1 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
              Total POS
            </p>
            <p className="text-lg font-black text-blue-400 tabular-nums flex items-center gap-1">
              <FaNairaSign size={10} />{' '}
              {formatAmount(stats.lodgePos + stats.drinkPos)}
            </p>
          </div>
          <div className="flex-1 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
              Total Cash
            </p>
            <p className="text-lg font-black text-emerald-400 tabular-nums flex items-center gap-1">
              <FaNairaSign size={10} />{' '}
              {formatAmount(stats.lodgeCash + stats.drinkCash)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueBreakdown;
