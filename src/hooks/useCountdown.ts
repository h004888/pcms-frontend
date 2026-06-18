// =====================================================
// useCountdown hook — đếm ngược tới 1 target date
// Dùng cho flash sale, voucher expiry, vaccine booking
// =====================================================

'use client';

import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number; // seconds remaining (negative nếu đã qua)
}

function calc(target: number, now: number): TimeLeft {
  const diff = Math.floor((target - now) / 1000);
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  return { days, hours, minutes, seconds, total: diff };
}

export function useCountdown(targetIso: string): TimeLeft {
  const target = new Date(targetIso).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Tick mỗi giây
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return calc(target, now);
}

export function formatCountdown(t: TimeLeft, withSeconds = true): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  if (t.days > 0) {
    return `${t.days} ngày ${pad(t.hours)}:${pad(t.minutes)}${withSeconds ? `:${pad(t.seconds)}` : ''}`;
  }
  return `${pad(t.hours)}:${pad(t.minutes)}${withSeconds ? `:${pad(t.seconds)}` : ''}`;
}
