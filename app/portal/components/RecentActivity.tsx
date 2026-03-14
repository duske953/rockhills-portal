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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden w-full">
      <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter italic">
          Recent Activities
        </h3>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
          Live Feed
        </span>
      </div>

      <div className="divide-y divide-slate-50">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="p-4 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 leading-tight uppercase tracking-tight">
                    {booking.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase">
                      <Bed size={12} className="text-primary/50" /> Rm{' '}
                      {booking.room}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase">
                      <Clock size={12} className="text-primary/50" />{' '}
                      {booking.stayType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-center text-slate-900 font-black gap-1 text-lg">
                  <FaNairaSign size={14} className="text-primary" />
                  <span>{new Intl.NumberFormat().format(booking.amount)}</span>
                </div>
                <div className="mt-1">
                  <span className="text-[9px] font-black uppercase text-slate-500 px-2 py-1 rounded-lg border border-slate-200 bg-white flex items-center gap-1.5 shadow-sm">
                    <CreditCard size={10} className="text-primary" />{' '}
                    {booking.paymentType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-50/30 text-center border-t border-slate-50">
        <button className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.2em] flex items-center gap-2 mx-auto transition-all">
          Audit Full History <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
