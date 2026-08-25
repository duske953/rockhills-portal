'use client';
import { useState, useEffect } from 'react';
import moment from 'moment';

export default function LiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(moment().format('hh:mm A'));
    const timer = setInterval(() => {
      setTime(moment().format('hh:mm A'));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return null;

  return <span className="text-sm text-slate-400 font-medium">{time}</span>;
}
