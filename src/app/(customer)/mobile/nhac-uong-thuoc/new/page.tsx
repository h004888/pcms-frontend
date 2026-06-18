// =====================================================
// /mobile/nhac-uong-thuoc/new — MOBILE-MED-REMINDER create (polished)
// Form với full state + validation + save → list
// =====================================================

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Bell, Clock, Save, ArrowLeft, Plus, X } from 'lucide-react';
import { useReminders, freqLabel, type Reminder } from '@/hooks/useReminders';
import clsx from 'clsx';

const MEDICINES = [
  'Paracetamol 500mg',
  'Amoxicillin 500mg',
  'Amlodipine 5mg',
  'Metformin 500mg',
  'Atorvastatin 20mg',
  'Vitamin D3 1000IU',
  'Khác (nhập tên)',
];

const FREQUENCIES: { id: Reminder['frequency']; label: string; timesCount: number }[] = [
  { id: 'daily', label: 'Hằng ngày', timesCount: 1 },
  { id: 'bid', label: '2 lần/ngày', timesCount: 2 },
  { id: 'tid', label: '3 lần/ngày', timesCount: 3 },
  { id: 'weekly', label: 'Hàng tuần', timesCount: 1 },
];

export default function NewReminderPage() {
  const router = useRouter();
  const { add } = useReminders();
  const [medicine, setMedicine] = useState('');
  const [customMedicine, setCustomMedicine] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<Reminder['frequency']>('daily');
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ medicine?: string; dosage?: string; times?: string }>({});

  const finalMedicine = useMemo(
    () => (medicine === 'Khác (nhập tên)' ? customMedicine.trim() : medicine),
    [medicine, customMedicine]
  );

  const expectedTimesCount =
    FREQUENCIES.find((f) => f.id === frequency)?.timesCount ?? 1;

  const updateTime = (idx: number, value: string) => {
    setTimes((prev) => prev.map((t, i) => (i === idx ? value : t)));
    if (errors.times) setErrors((e) => ({ ...e, times: undefined }));
  };

  const addTimeSlot = () => {
    if (times.length >= 3) {
      toast.error('Tối đa 3 khung giờ/ngày');
      return;
    }
    setTimes((prev) => [...prev, '12:00']);
  };

  const removeTimeSlot = (idx: number) => {
    if (times.length <= 1) return;
    setTimes((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!finalMedicine) e.medicine = 'Vui lòng chọn hoặc nhập tên thuốc';
    if (!dosage.trim()) e.dosage = 'Vui lòng nhập liều dùng';
    const validTimes = times.filter((t) => t);
    if (validTimes.length === 0) e.times = 'Vui lòng chọn ít nhất 1 khung giờ';
    return e;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Vui lòng hoàn thiện các trường bắt buộc');
      return;
    }
    add({
      medicine: finalMedicine,
      dosage,
      frequency,
      times: times.filter((t) => t),
      note: note.trim() || undefined,
    });
    toast.success('Đã tạo nhắc nhở');
    router.push('/mobile/nhac-uong-thuoc');
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/mobile/nhac-uong-thuoc"
          className="p-2 -ml-2 text-ink-700 hover:text-ink-900 rounded transition-colors"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </Link>
        <div>
          <Breadcrumb items={[{ label: 'Nhắc uống thuốc', href: '/mobile/nhac-uong-thuoc' }, { label: 'Tạo mới' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Tạo nhắc nhở mới</h1>
        </div>
      </div>

      <form onSubmit={submit} className="p-5 bg-white border border-ink-200 rounded-md space-y-4">
        <div>
          <label htmlFor="med" className="text-sm font-semibold text-ink-900 block mb-1">
            Thuốc *
          </label>
          <select
            id="med"
            value={medicine}
            onChange={(e) => {
              setMedicine(e.target.value);
              if (errors.medicine) setErrors((er) => ({ ...er, medicine: undefined }));
            }}
            className={inputClass(!!errors.medicine)}
          >
            <option value="">-- Chọn thuốc --</option>
            {MEDICINES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {medicine === 'Khác (nhập tên)' && (
            <input
              type="text"
              value={customMedicine}
              onChange={(e) => setCustomMedicine(e.target.value)}
              placeholder="Nhập tên thuốc..."
              className="mt-2 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
          )}
          {errors.medicine && (
            <p className="mt-1 text-xs text-danger-600 flex items-center gap-1">
              <X className="w-3 h-3" aria-hidden="true" />
              {errors.medicine}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="dosage" className="text-sm font-semibold text-ink-900 block mb-1">
              Liều dùng *
            </label>
            <input
              id="dosage"
              type="text"
              value={dosage}
              onChange={(e) => {
                setDosage(e.target.value);
                if (errors.dosage) setErrors((er) => ({ ...er, dosage: undefined }));
              }}
              placeholder="1 viên"
              className={inputClass(!!errors.dosage)}
            />
            {errors.dosage && (
              <p className="mt-1 text-xs text-danger-600 flex items-center gap-1">
                <X className="w-3 h-3" aria-hidden="true" />
                {errors.dosage}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="freq" className="text-sm font-semibold text-ink-900 block mb-1">
              Tần suất
            </label>
            <select
              id="freq"
              value={frequency}
              onChange={(e) => {
                const f = e.target.value as Reminder['frequency'];
                setFrequency(f);
                const expected = FREQUENCIES.find((x) => x.id === f)?.timesCount ?? 1;
                setTimes((prev) => {
                  if (prev.length < expected) {
                    return [...prev, ...Array(expected - prev.length).fill('12:00')];
                  }
                  return prev.slice(0, expected);
                });
              }}
              className="w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            >
              {FREQUENCIES.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-ink-900 mb-2">
            Giờ nhắc * <span className="font-normal text-ink-500">({expectedTimesCount} khung giờ cho {freqLabel(frequency).toLowerCase()})</span>
          </legend>
          <div className="space-y-2">
            {times.map((t, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-ink-500 w-16">Lần {idx + 1}</span>
                <div className="relative flex-1">
                  <Clock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="time"
                    value={t}
                    onChange={(e) => updateTime(idx, e.target.value)}
                    className={clsx(inputClass(!!errors.times), 'font-mono')}
                  />
                </div>
                {times.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(idx)}
                    aria-label={`Xóa khung giờ ${idx + 1}`}
                    className="p-2 text-ink-400 hover:text-danger-600"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {times.length < 3 && (
            <button
              type="button"
              onClick={addTimeSlot}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent-700 hover:text-accent-800"
            >
              <Plus className="w-3 h-3" aria-hidden="true" />
              Thêm khung giờ
            </button>
          )}
          {errors.times && (
            <p className="mt-1 text-xs text-danger-600 flex items-center gap-1">
              <X className="w-3 h-3" aria-hidden="true" />
              {errors.times}
            </p>
          )}
        </fieldset>

        <div>
          <label htmlFor="note" className="text-sm font-semibold text-ink-900 block mb-1">
            Ghi chú
          </label>
          <textarea
            id="note"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Uống sau bữa ăn, tránh xa bữa sữa..."
            className="w-full px-3 py-2 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
          />
        </div>

        <div className="p-3 bg-info-50 border border-info-200 rounded-md text-xs text-info-800">
          <Bell className="inline w-3.5 h-3.5 mr-1" aria-hidden="true" />
          Nhắc nhở sẽ gửi push notification đúng giờ — cần bật quyền trong cài đặt trình duyệt.
        </div>

        <div className="flex gap-2 pt-2 border-t border-ink-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 h-11 text-sm font-medium border border-ink-200 rounded-md hover:bg-ink-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="flex-1 h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            Lưu nhắc nhở
          </button>
        </div>
      </form>
    </>
  );
}

function inputClass(hasError: boolean): string {
  return [
    'w-full h-10 px-3 text-sm border rounded-md focus:outline-none focus:ring-2',
    hasError
      ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-200'
      : 'border-ink-200 focus:border-accent-500 focus:ring-accent-200',
  ].join(' ');
}