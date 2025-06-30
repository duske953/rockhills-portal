import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';

export default function DropDownRooms({
  activeRoom,
  setActiveRoom,
}: {
  activeRoom: { room: number; checked: boolean; price: number }[];
  setActiveRoom: React.Dispatch<
    React.SetStateAction<{ room: number; checked: boolean; price: number }[]>
  >;
}) {
  function renderRoomChange(rooms: number) {
    setActiveRoom(
      activeRoom.map((room) => {
        if (room.room === rooms) {
          return {
            ...room,
            checked: !room.checked,
          };
        }
        return {
          ...room,
          checked: false,
        };
      })
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-none cursor-pointer" variant="outline">
          Rooms
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Rooms</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {activeRoom.map((room) => (
          <DropdownMenuCheckboxItem
            key={room.room}
            checked={room.checked}
            onCheckedChange={() => renderRoomChange(room.room)}
          >
            {room.room}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
