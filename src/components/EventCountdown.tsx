import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { config } from '../config';

export const EventCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = config.recruitment.targetDeadlineMs - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, expired: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (timeLeft.expired) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
        <Clock className="w-4 h-4" />
        <span>Applications Currently Closed for this term</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1.5 text-xs text-stone-300 font-mono mb-3">
        <Clock className="w-4 h-4 text-[#F26A2E] animate-pulse" />
        <span>RECRUITMENT APPLICATION CLOSES IN:</span>
      </div>

      <div className="flex items-center justify-center gap-1.5 sm:gap-4">
        {/* Days */}
        <div className="flex flex-col items-center glass-card p-2.5 sm:p-4 rounded-2xl min-w-[56px] xs:min-w-[64px] sm:min-w-[80px] border border-stone-800">
          <span className="font-cinzel text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#F26A2E] text-glow-orange">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="font-mono text-[9px] sm:text-xs text-stone-300 uppercase mt-0.5">
            Days
          </span>
        </div>

        <span className="font-cinzel text-lg sm:text-xl text-[#F26A2E] font-bold">:</span>

        {/* Hours */}
        <div className="flex flex-col items-center glass-card p-2.5 sm:p-4 rounded-2xl min-w-[56px] xs:min-w-[64px] sm:min-w-[80px] border border-stone-800">
          <span className="font-cinzel text-xl xs:text-2xl sm:text-3xl font-extrabold text-amber-400">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="font-mono text-[9px] sm:text-xs text-stone-300 uppercase mt-0.5">
            Hours
          </span>
        </div>

        <span className="font-cinzel text-lg sm:text-xl text-[#F26A2E] font-bold">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center glass-card p-2.5 sm:p-4 rounded-2xl min-w-[56px] xs:min-w-[64px] sm:min-w-[80px] border border-stone-800">
          <span className="font-cinzel text-xl xs:text-2xl sm:text-3xl font-extrabold text-stone-100">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="font-mono text-[9px] sm:text-xs text-stone-300 uppercase mt-0.5">
            Mins
          </span>
        </div>

        <span className="font-cinzel text-lg sm:text-xl text-[#F26A2E] font-bold">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center glass-card p-2.5 sm:p-4 rounded-2xl min-w-[56px] xs:min-w-[64px] sm:min-w-[80px] border border-stone-800">
          <span className="font-cinzel text-xl xs:text-2xl sm:text-3xl font-extrabold text-[#F26A2E]">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="font-mono text-[9px] sm:text-xs text-stone-300 uppercase mt-0.5">
            Secs
          </span>
        </div>
      </div>
    </div>
  );
};
