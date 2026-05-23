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
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1 h-3 bg-slate-900 rounded-full" />
            Revenue Summary
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <CreditCard size={10} /> Total POS
              </p>
              <p className="text-xl font-bold text-slate-900 tabular-nums flex items-center gap-1">
                <FaNairaSign className="text-xs opacity-40" />
                {formatAmount(stats.lodgePos + stats.drinkPos)}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Wallet size={10} /> Total Cash
              </p>
              <p className="text-xl font-bold text-slate-900 tabular-nums flex items-center gap-1">
                <FaNairaSign className="text-xs opacity-40" />
                {formatAmount(stats.lodgeCash + stats.drinkCash)}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Receipt size={10} /> Total Amount
              </p>
              <p className="text-xl font-bold text-slate-900 tabular-nums flex items-center gap-1">
                <FaNairaSign className="text-xs opacity-40" />
                {formatAmount(
                  stats.lodgePos +
                    stats.lodgeCash +
                    stats.drinkPos +
                    stats.drinkCash,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueBreakdown;
