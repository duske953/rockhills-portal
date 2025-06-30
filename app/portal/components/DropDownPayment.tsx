import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
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
      })
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-none cursor-pointer" variant="outline">
          Method of payment
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Rooms</DropdownMenuLabel>
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
