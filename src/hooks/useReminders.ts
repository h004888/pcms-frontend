// =====================================================
// useReminders hook — persist medication reminders
// Dùng localStorage, share giữa list + create pages
// =====================================================

'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Reminder {
  id: string;
  medicine: string;
  dosage: string;
  frequency: 'daily' | 'bid' | 'tid' | 'weekly';
  times: string[]; // ['08:00', '20:00']
  note?: string;
  active: boolean;
  createdAt: string;
  /** ISO date strings (yyyy-mm-dd) cho 30 ngày qua — true nếu user đã tick "đã uống" */
  adherence: Record<string, boolean>;
}

const STORAGE_KEY = 'pcms-reminders';

const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'r-1',
    medicine: 'Amlodipine 5mg',
    dosage: '1 viên',
    frequency: 'daily',
    times: ['08:00'],
    active: true,
    createdAt: '2026-05-15',
    adherence: generateRecentAdherence(0.85),
  },
  {
    id: 'r-2',
    medicine: 'Metformin 500mg',
    dosage: '1 viên',
    frequency: 'bid',
    times: ['08:00', '20:00'],
    active: true,
    createdAt: '2026-04-20',
    adherence: generateRecentAdherence(0.6),
  },
  {
    id: 'r-3',
    medicine: 'Vitamin D3 1000IU',
    dosage: '1 viên',
    frequency: 'daily',
    times: ['08:00'],
    note: 'Uống sau bữa sáng',
    active: false,
    createdAt: '2026-03-01',
    adherence: generateRecentAdherence(0.4),
  },
];

function generateRecentAdherence(rate: number): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out[d.toISOString().slice(0, 10)] = Math.random() < rate;
  }
  return out;
}

const FREQ_LABEL: Record<Reminder['frequency'], string> = {
  daily: 'Hằng ngày',
  bid: '2 lần/ngày',
  tid: '3 lần/ngày',
  weekly: 'Hàng tuần',
};

export function freqLabel(f: Reminder['frequency']): string {
  return FREQ_LABEL[f];
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [hydrated, setHydrated] = useState(false);

  // Load từ localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Reminder[];
        if (Array.isArray(parsed)) setReminders(parsed);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist khi thay đổi (chỉ sau hydrate)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    } catch {
      // ignore
    }
  }, [reminders, hydrated]);

  const add = useCallback(
    (r: Omit<Reminder, 'id' | 'createdAt' | 'adherence' | 'active'>) => {
      const newReminder: Reminder = {
        ...r,
        id: `r-${Date.now()}`,
        createdAt: new Date().toISOString().slice(0, 10),
        active: true,
        adherence: {},
      };
      setReminders((prev) => [...prev, newReminder]);
      return newReminder;
    },
    []
  );

  const update = useCallback(
    (id: string, patch: Partial<Omit<Reminder, 'id' | 'createdAt'>>) => {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
      );
    },
    []
  );

  const remove = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const toggleActive = useCallback(
    (id: string) => {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
      );
    },
    []
  );

  const markTaken = useCallback((id: string, date: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, adherence: { ...r.adherence, [date]: true } }
          : r
      )
    );
  }, []);

  /** Tính adherence rate trong 30 ngày qua */
  function adherenceRate(r: Reminder): number {
    const values = Object.values(r.adherence);
    if (values.length === 0) return 0;
    const taken = values.filter(Boolean).length;
    return taken / values.length;
  }

  return {
    reminders,
    hydrated,
    add,
    update,
    remove,
    toggleActive,
    markTaken,
    adherenceRate,
  };
}