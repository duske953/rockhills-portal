'use client';
import { FaNairaSign } from 'react-icons/fa6';
import { formatAmount } from '@/app/utils/formatAmount';
import Expenses from '@/app/portal/components/Expenses';

const EntryDetailPanel = ({ report, type }: { report: any; type?: string }) => {
  return (
    <div className="lg:w-80 space-y-4">
      <div className="flex items-center gap-2">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Entry Detail
        </h4>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-100 space-y-6">
        {type === 'worker' && (
          <Expenses
            savedExpenses={report.expenses || []}
            workerId={report.id}
            label="Add expense"
          />
        )}

        {/* Mini Ledger */}
        <div className="space-y-4">
          {report.expenses.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Expenses
              </p>
              <div className="space-y-1">
                {report.expenses.map((expense: any) => (
                  <div
                    key={crypto.randomUUID()}
                    className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100"
                  >
                    <span className="text-xs font-medium text-slate-600 truncate max-w-[120px]">
                      {expense.expense}
                    </span>
                    <span className="text-xs font-bold text-rose-600 flex items-center">
                      - <FaNairaSign size={8} />{' '}
                      {new Intl.NumberFormat().format(expense.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Final Audit Summary */}
        <div className="pt-2 border-t border-slate-50">
          <div className="space-y-4">
            <div className="flex flex-col gap-1 p-4 bg-slate-900 rounded-xl text-white">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                POS Remittance
              </p>
              <p className="text-2xl font-bold flex items-center gap-1.5 tabular-nums">
                <FaNairaSign className="text-sm opacity-60" />
                {formatAmount(report.approvedAmount?.totalPos || 0)}
              </p>
            </div>

            <div className="flex flex-col gap-1 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Cash Handover
              </p>
              <p className="text-2xl font-bold text-slate-900 flex items-center gap-1.5 tabular-nums">
                <FaNairaSign className="text-sm opacity-40" />
                {formatAmount(report.approvedAmount?.totalCash || 0)}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EntryDetailPanel;
