'use client';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import moment from 'moment';

export default function LiveClock() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    setTime(moment().format('hh:mm:ss A'));
    setDate(moment().format('dddd, MMMM Do YYYY'));

    const timer = setInterval(() => {
      setTime(moment().format('hh:mm:ss A'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time) return null;

  return (
    <div className="flex flex-col items-end text-right">
      <div className="flex items-center gap-2 text-primary font-bold tracking-tight">
        <Clock className="w-4 h-4" />
        <span className="text-xl tabular-nums">{time}</span>
      </div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
        {date}
      </p>
    </div>
  );
}
