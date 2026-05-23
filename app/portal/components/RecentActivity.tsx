'use client';
import { User, Bed, CreditCard, Clock, ArrowRight } from 'lucide-react';
import { FaNairaSign } from 'react-icons/fa6';

interface RecentBooking {
  id: string;
  name: string;
  room: number;
  amount: number;
  paymentType: string;
  stayType: string;
  checkInTime: string;
}

export default function RecentActivity({
  bookings,
}: {
  bookings: RecentBooking[];
}) {
  if (bookings.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden w-full">
      <div className="px-6 py-4 border-b border-slate-50 bg-slate-50 flex justify-between items-center">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Recent Activity
        </h3>
        <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-widest">
          Live
        </span>
      </div>

      <div className="divide-y divide-slate-50">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="p-4 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 transition-colors">
                  <User size={16} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 leading-tight uppercase text-xs tracking-tight">
                    {booking.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                      <Bed size={10} /> Rm {booking.room}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                      <Clock size={10} /> {booking.stayType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-center text-slate-900 font-bold gap-1 text-sm">
                  <FaNairaSign size={10} className="opacity-30" />
                  <span>{new Intl.NumberFormat().format(booking.amount)}</span>
                </div>
                <div className="mt-1">
                  <span className="text-[8px] font-bold uppercase text-slate-400 px-1.5 py-0.5 rounded border border-slate-100 bg-white shadow-sm">
                    {booking.paymentType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-50/50 text-center border-t border-slate-50">
        <button className="text-[9px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest flex items-center gap-1.5 mx-auto transition-colors">
          View History <ArrowRight size={10} />
        </button>
      </div>
    </div>
  );
}
