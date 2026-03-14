import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import { CreditCard, ChevronDown } from 'lucide-react';

export default function DropDownPayment({
  payments,
  setPayment,
}: {
  payments: { type: string; checked: boolean }[];
  setPayment: React.Dispatch<
    React.SetStateAction<{ type: string; checked: boolean }[]>
  >;
}) {
  function renderPaymentChange(type: string) {
    setPayment(
      payments.map((payment) => {
        if (payment.type === type) {
          return {
            ...payment,
            checked: !payment.checked,
          };
        }
        return {
          ...payment,
          checked: false,
        };
      }),
    );
  }

  const selectedPayment = payments.find((p) => p.checked);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer gap-2" variant="outline">
          <CreditCard className="w-4 h-4 opacity-70" />
          {selectedPayment ? selectedPayment.type : 'Payment Method'}
          <ChevronDown className="w-4 h-4 opacity-50 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Payment Methods</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {payments.map((payment) => (
          <DropdownMenuCheckboxItem
            checked={payment.checked}
            onCheckedChange={() => renderPaymentChange(payment.type)}
            key={payment.type}
          >
            {payment.type}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
