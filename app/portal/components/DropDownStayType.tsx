import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
export default function DropDownStayType({
  stayType,
  setStayType,
}: {
  stayType: { stay: string; checked: boolean }[];
  setStayType: React.Dispatch<
    React.SetStateAction<{ stay: string; checked: boolean }[]>
  >;
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
      })
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-none cursor-pointer" variant="outline">
          METHOD OF STAY
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>TYPE</DropdownMenuLabel>
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
