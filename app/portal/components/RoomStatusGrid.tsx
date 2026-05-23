'use client';
import { cn } from '@/app/lib/utils';
import { Bed } from 'lucide-react';

interface Room {
  room: number;
  booked: boolean;
  price?: number;
}

export default function RoomStatusGrid({ rooms }: { rooms: Room[] }) {
  const sortedRooms = [...rooms].sort((a, b) => a.room - b.room);
  const occupiedCount = rooms.filter((r) => r.booked).length;
  const availableCount = rooms.length - occupiedCount;

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
            Room Status
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Real-time occupancy tracking
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {availableCount} Free
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {occupiedCount} Booked
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-12 gap-3">
        {sortedRooms.map((room) => (
          <div
            key={room.room}
            className={cn(
              'group relative flex flex-col items-center justify-center py-4 rounded-xl border transition-colors',
              room.booked
                ? 'bg-rose-50/30 border-rose-100 text-rose-600'
                : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-300',
            )}
          >
            <Bed
              className={cn(
                'w-4 h-4 mb-1',
                room.booked ? 'opacity-40' : 'opacity-20',
              )}
            />
            <span className="text-sm font-bold tracking-tight">
              {room.room}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
