import { formatAmount } from '@/app/utils/formatAmount';
import { FaNairaSign } from 'react-icons/fa6';

export function DisplayAmount({
  type,
  amount,
}: {
  type: string;
  amount: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs uppercase text-slate-400 tracking-[0.35em]">
        {type}
      </p>
      <p className="flex items-center gap-1 font-black text-lg text-slate-900">
        <FaNairaSign className="text-primary" />
        {formatAmount(amount)}
      </p>
    </div>
  );
}
