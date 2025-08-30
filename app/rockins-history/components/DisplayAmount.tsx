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
    <li className="flex items-center">
      Total {type}: <FaNairaSign />
      {formatAmount(amount)}
    </li>
  );
}
