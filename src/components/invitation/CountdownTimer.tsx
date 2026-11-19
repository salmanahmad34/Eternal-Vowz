'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  targetDate: string;
  accentColor?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export default function CountdownTimer({ targetDate, accentColor = '#C5A059' }: CountdownTimerProps) {
  const [time, setTime] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTime({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'DAYS', value: time.days },
    { label: 'HOURS', value: time.hours },
    { label: 'MINUTES', value: time.minutes },
    { label: 'SECONDS', value: time.seconds },
  ];

  return (
    <div className="w-full my-8">
      <div className="text-center mb-3">
        <span className="text-[10px] tracking-[0.3em] font-semibold uppercase text-stone-500 font-sans">
          {time.isPast ? "THE CELEBRATION HAS COMMENCED" : "COUNTING DOWN TO THE MOMENT"}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm sm:max-w-md mx-auto">
        {units.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-lg bg-stone-50/90 border border-stone-200/80 shadow-sm relative overflow-hidden group hover:border-[#C5A059]/60 transition-colors"
          >
            {/* Top gold accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: accentColor }}
            />
            <span className="font-serif text-2xl sm:text-3xl font-semibold text-stone-800 tracking-tight">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[10px] font-sans tracking-widest text-stone-400 font-medium uppercase mt-0.5">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
