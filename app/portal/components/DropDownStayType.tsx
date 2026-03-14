import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import { Clock, ChevronDown } from 'lucide-react';

export default function DropDownStayType({
  stayType,
  setStayType,
  type,
}: {
  stayType: { stay: string; checked: boolean }[];
  setStayType: React.Dispatch<
    React.SetStateAction<{ stay: string; checked: boolean }[]>
  >;
  type: string;
}) {
  function renderPaymentChange(activeStay: string) {
    setStayType(
      stayType.map((stay) => {
        if (stay.stay === activeStay) {
          return {
            ...stay,
            checked: !stay.checked,
          };
        }
        return {
          ...stay,
          checked: false,
        };
      }),
    );
  }

  const selectedStay = stayType.find((s) => s.checked);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer gap-2" variant="outline">
          <Clock className="w-4 h-4 opacity-70" />
          {selectedStay ? selectedStay.stay : type}
          <ChevronDown className="w-4 h-4 opacity-50 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Stay Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {stayType.map((stay) => (
          <DropdownMenuCheckboxItem
            checked={stay.checked}
            onCheckedChange={() => renderPaymentChange(stay.stay)}
            key={stay.stay}
          >
            {stay.stay}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
