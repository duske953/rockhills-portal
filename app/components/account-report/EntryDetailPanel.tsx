'use client';
import { CheckCircle2 } from 'lucide-react';
import { FaNairaSign } from 'react-icons/fa6';
import { formatAmount } from '@/app/utils/formatAmount';
import Expenses from '@/app/portal/components/Expenses';
import DrinkSales from '@/app/portal/components/DrinkSales';

const EntryDetailPanel = ({
  report,
  type,
  objectToArrObj,
}: {
  report: any;
  type?: string;
  objectToArrObj: (obj: any) => { amount: number; method: string }[];
}) => {
  return (
    <div className="lg:w-80 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-0.5 w-6 bg-primary rounded-full" />
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
          Entry Detail
        </h4>
      </div>

      <div className="bg-white rounded-3xl p-3 sm:p-6 border border-slate-100 shadow-sm space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pb-6 border-b border-slate-100">
          {type === 'worker' && (
            <>
              <Expenses savedExpenses={report.expenses} workerId={report.id} />
              {!report.drinkSales?.pos && !report.drinkSales?.cash && (
                <DrinkSales
                  savedDrinkSales={report.drinkSales}
                  workerId={report.id}
                />
              )}
            </>
          )}
        </div>

        {/* Mini Ledger */}
        <div className="space-y-4">
          {report.expenses.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-3">
                Expenses Record
              </p>
              <div className="space-y-2">
                {report.expenses.map((expense: any) => (
                  <div
                    key={crypto.randomUUID()}
                    className="flex justify-between items-center bg-rose-50/30 p-2 rounded-xl border border-rose-50"
                  >
                    <span className="text-xs font-bold text-slate-600 truncate max-w-[120px]">
                      {expense.expense}
                    </span>
                    <span className="text-xs font-black text-rose-600 flex items-center">
                      - <FaNairaSign size={8} />{' '}
                      {new Intl.NumberFormat().format(expense.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {objectToArrObj(report.drinkSales).length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-3">
                Liquor Ledger
              </p>
              <div className="space-y-2">
                {objectToArrObj(report.drinkSales).map((sales) => (
                  <div
                    key={sales.method}
                    className="flex justify-between items-center bg-amber-50/30 p-2 rounded-xl border border-amber-50"
                  >
                    <span className="text-xs font-bold text-slate-600">
                      Sales ({sales.method})
                    </span>
                    <span className="text-xs font-black text-amber-600 flex items-center">
                      + <FaNairaSign size={8} />{' '}
                      {new Intl.NumberFormat().format(sales.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Final Audit Stamp */}
        <div className="pt-2">
          <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/40 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
              <CheckCircle2 size={120} />
            </div>

            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-primary-foreground/60 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                  Final Approved Totals
                </p>
                <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-tighter italic">
                  Account Audit Statement
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1 p-4 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">
                    POS Remittance
                  </p>
                  <p className="text-3xl font-black flex items-center gap-1.5 tabular-nums">
                    <FaNairaSign className="text-base opacity-90" />
                    {formatAmount(report.approvedAmount?.totalPos || 0)}
                  </p>
                </div>

                <div className="flex flex-col gap-1 p-4 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">
                    Cash Handover
                  </p>
                  <p className="text-3xl font-black flex items-center gap-1.5 tabular-nums">
                    <FaNairaSign className="text-base opacity-90" />
                    {formatAmount(report.approvedAmount?.totalCash || 0)}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 opacity-60">
                <div className="h-px flex-1 bg-white/20" />
                <span className="text-[8px] font-black uppercase tracking-widest">
                  Verified Signature
                </span>
                <div className="h-px flex-1 bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryDetailPanel;
