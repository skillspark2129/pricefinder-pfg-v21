import { useEffect, useState } from 'react';

interface Countdown {
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function splitRemaining(ms: number): Countdown {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    expired: ms <= 0,
  };
}

export function useCountdown(deadlineMs: number): Countdown {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return splitRemaining(deadlineMs - now);
}
