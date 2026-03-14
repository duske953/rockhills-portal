import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import { Bed, ChevronDown } from 'lucide-react';

export default function DropDownRooms({
  activeRoom,
  setActiveRoom,
}: {
  activeRoom: { room: number; checked: boolean; price: number }[];
  setActiveRoom: React.Dispatch<
    React.SetStateAction<{ room: number; checked: boolean; price: number }[]>
  >;
}) {
  function renderRoomChange(roomNumber: number) {
    setActiveRoom(
      activeRoom.map((room) => {
        if (room.room === roomNumber) {
          return {
            ...room,
            checked: !room.checked,
          };
        }
        return {
          ...room,
          checked: false,
        };
      }),
    );
  }

  const selectedRoom = activeRoom.find((r) => r.checked);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer gap-2" variant="outline">
          <Bed className="w-4 h-4 opacity-70" />
          {selectedRoom ? `Room ${selectedRoom.room}` : 'Select Room'}
          <ChevronDown className="w-4 h-4 opacity-50 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Available Rooms</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {activeRoom.map((room) => (
          <DropdownMenuCheckboxItem
            key={room.room}
            checked={room.checked}
            onCheckedChange={() => renderRoomChange(room.room)}
          >
            Room {room.room}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
