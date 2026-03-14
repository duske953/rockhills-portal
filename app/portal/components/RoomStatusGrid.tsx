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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tighter">
            Room Status Overview
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Real-time occupancy tracking across the hotel
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 font-bold">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm text-slate-600 uppercase tracking-tight">
              {availableCount} Free
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-sm text-slate-600 uppercase tracking-tight">
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
              'group relative flex flex-col items-center justify-center py-4 rounded-xl border transition-all duration-300',
              room.booked
                ? 'bg-rose-50 border-rose-100 text-rose-600'
                : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:border-emerald-300 hover:shadow-md',
            )}
          >
            <Bed
              className={cn(
                'w-5 h-5 mb-1',
                room.booked ? 'opacity-30' : 'opacity-60',
              )}
            />
            <span className="text-sm font-black tracking-tight">
              {room.room}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
