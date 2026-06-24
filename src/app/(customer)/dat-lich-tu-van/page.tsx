// =====================================================
// /dat-lich-tu-van — STORE-CONSULT (real API)
// Đặt lịch tư vấn dược sĩ — /api/v1/consultations
// =====================================================

'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Calendar, User, MessageSquare, Check, Loader2 } from 'lucide-react';
import { createConsultation } from '@/features/consultations';
import toast from 'react-hot-toast';

const CONSULT_TYPES = [
  { id: 'IN_PERSON', label: 'Trực tiếp tại nhà thuốc', icon: User },
  { id: 'PHONE', label: 'Tư vấn qua điện thoại', icon: MessageSquare },
  { id: 'VIDEO', label: 'Video call', icon: MessageSquare },
] as const;

const TIME_SLOTS = [
  '08:00 — 09:00',
  '09:00 — 10:00',
  '10:00 — 11:00',
  '14:00 — 15:00',
  '15:00 — 16:00',
  '16:00 — 17:00',
];

export default function DatLichTuVanPage() {
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<string>('IN_PERSON');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [note, setNote] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone || !date) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setSubmitting(true);
    try {
      const scheduledAt = `${date}T${slot.split(' — ')[0]}:00`;
      await createConsultation({
        customerId: 'me',
        type,
        topic: note || 'Tư vấn dược sĩ',
        scheduledAt,
      });
      toast.success(
        'Đặt lịch tư vấn thành công! Dược sĩ sẽ liên hệ bạn trong ít phút.'
      );
      setName('');
      setPhone('');
      setEmail('');
      setNote('');
    } catch {
      toast.error('Đặt lịch thất bại, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Đặt lịch tư vấn' }]} />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Đặt lịch tư vấn dược sĩ
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Tư vấn 1-1 về thuốc, liều dùng, tương tác — miễn phí cho khách hàng PCMS.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
        <form
          onSubmit={handleSubmit}
          className="p-5 bg-white border border-ink-200 rounded-md space-y-5"
        >
          <fieldset>
            <legend className="text-sm font-semibold text-ink-900 mb-2">
              Hình thức tư vấn
            </legend>
            <div className="space-y-2">
              {CONSULT_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <label
                    key={t.id}
                    className="flex items-center gap-3 p-3 border border-ink-200 rounded-md cursor-pointer hover:border-accent-500 has-[:checked]:border-accent-600 has-[:checked]:bg-accent-50"
                  >
                    <input
                      type="radio"
                      name="type"
                      checked={type === t.id}
                      onChange={() => setType(t.id)}
                      className="w-4 h-4 text-accent-600 focus:ring-accent-500"
                    />
                    <Icon className="w-4 h-4 text-ink-600" aria-hidden="true" />
                    <span className="text-sm font-medium text-ink-900">
                      {t.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label htmlFor="name" className="text-sm font-semibold text-ink-900">
              Họ tên *
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="phone" className="text-sm font-semibold text-ink-900">
                Số điện thoại *
              </label>
              <input
                id="phone"
                type="tel"
                required
                placeholder="0901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full h-10 px-3 text-sm font-mono border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-semibold text-ink-900">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="date" className="text-sm font-semibold text-ink-900">
              Ngày hẹn *
            </label>
            <div className="relative mt-1">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 pl-9 pr-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-ink-900">
              Khung giờ *
            </label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TIME_SLOTS.map((s) => (
                <label
                  key={s}
                  className="flex items-center justify-center gap-1 p-2 text-xs font-mono border border-ink-200 rounded-md cursor-pointer hover:border-accent-500 has-[:checked]:border-accent-600 has-[:checked]:bg-accent-50"
                >
                  <input
                    type="radio"
                    name="slot"
                    checked={slot === s}
                    onChange={() => setSlot(s)}
                    className="sr-only"
                  />
                  <span className="text-ink-700">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="note" className="text-sm font-semibold text-ink-900">
              Nội dung cần tư vấn
            </label>
            <textarea
              id="note"
              rows={3}
              placeholder="Ví dụ: tôi đang dùng Paracetamol và Amoxicillin, có tương tác gì không?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 inline-flex items-center justify-center gap-2 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors disabled:bg-ink-300"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" aria-hidden="true" />
            )}
            {submitting ? 'Đang đặt lịch...' : 'Đặt lịch'}
          </button>
        </form>
      </div>
    </>
  );
}