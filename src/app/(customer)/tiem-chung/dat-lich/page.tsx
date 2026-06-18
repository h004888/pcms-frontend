// =====================================================
// /tiem-chung/dat-lich — VACCINE-BOOKING
// Đặt lịch tiêm vaccine
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Calendar, MapPin, User, Check } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đặt lịch tiêm',
  description: 'Đặt lịch tiêm vaccine tại nhà thuốc PCMS.',
};

const VACCINE_OPTIONS = [
  { id: 'vac-cum', label: 'Vaccine Cúm mùa', price: 350000 },
  { id: 'vac-covid', label: 'Vaccine COVID-19', price: 0 },
  { id: 'vac-viem-gan-b', label: 'Vaccine Viêm gan B', price: 250000 },
  { id: 'vac-uon-van', label: 'Vaccine Uốn ván (VAT)', price: 120000 },
  { id: 'vac-phoi-cum', label: 'Vaccine Phế cầu', price: 1500000 },
  { id: 'vac-cum-quadrivalent', label: 'Vaccine Cúm tứ giá', price: 480000 },
];

const STORE_OPTIONS = [
  'PCMS Quận 1 — TP.HCM',
  'PCMS Bình Thạnh — TP.HCM',
  'PCMS Ba Đình — Hà Nội',
  'PCMS Cầu Giấy — Hà Nội',
  'PCMS Hải Châu — Đà Nẵng',
];

const TIME_SLOTS = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'];

export default function DatLichTiemPage() {
  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Tiêm chủng', href: '/tiem-chung' },
              { label: 'Đặt lịch' },
            ]}
          />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Đặt lịch tiêm vaccine
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Điền thông tin, chọn nhà thuốc và khung giờ. Nhân viên sẽ gọi xác nhận.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
        <form className="p-5 bg-white border border-ink-200 rounded-md space-y-5">
          <fieldset>
            <legend className="text-sm font-semibold text-ink-900 mb-2">
              Chọn vaccine
            </legend>
            <div className="space-y-2">
              {VACCINE_OPTIONS.map((v, i) => (
                <label
                  key={v.id}
                  className="flex items-center justify-between gap-3 p-3 border border-ink-200 rounded-md cursor-pointer hover:border-accent-500 has-[:checked]:border-accent-600 has-[:checked]:bg-accent-50"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="vaccine"
                      defaultChecked={i === 0}
                      className="w-4 h-4 text-accent-600 focus:ring-accent-500"
                    />
                    <span className="text-sm font-medium text-ink-900">{v.label}</span>
                  </div>
                  <span className="text-sm font-semibold font-mono text-accent-700">
                    {v.price === 0 ? 'Miễn phí' : `${v.price.toLocaleString('vi-VN')} ₫`}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="store" className="text-sm font-semibold text-ink-900">
              <MapPin className="inline w-4 h-4 mr-1" aria-hidden="true" />
              Nhà thuốc
            </label>
            <select
              id="store"
              className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            >
              {STORE_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="bdate" className="text-sm font-semibold text-ink-900">
                Ngày tiêm *
              </label>
              <div className="relative mt-1">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="bdate"
                  type="date"
                  className="w-full h-10 pl-9 pr-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-ink-900">Khung giờ *</label>
              <div className="mt-1 grid grid-cols-3 gap-1">
                {TIME_SLOTS.map((slot, i) => (
                  <label
                    key={slot}
                    className="flex items-center justify-center h-10 text-xs font-mono border border-ink-200 rounded-md cursor-pointer hover:border-accent-500 has-[:checked]:border-accent-600 has-[:checked]:bg-accent-50"
                  >
                    <input
                      type="radio"
                      name="time"
                      defaultChecked={i === 0}
                      className="sr-only"
                    />
                    <span className="text-ink-700">{slot}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="bname" className="text-sm font-semibold text-ink-900">
                Họ tên người tiêm *
              </label>
              <input
                id="bname"
                type="text"
                placeholder="Nguyễn Văn A"
                className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
              />
            </div>
            <div>
              <label htmlFor="bage" className="text-sm font-semibold text-ink-900">
                Ngày sinh *
              </label>
              <input
                id="bage"
                type="date"
                className="mt-1 w-full h-10 px-3 text-sm font-mono border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="bphone" className="text-sm font-semibold text-ink-900">
                Số điện thoại *
              </label>
              <input
                id="bphone"
                type="tel"
                placeholder="0901234567"
                className="mt-1 w-full h-10 px-3 text-sm font-mono border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
              />
            </div>
            <div>
              <label htmlFor="bemail" className="text-sm font-semibold text-ink-900">
                Email
              </label>
              <input
                id="bemail"
                type="email"
                className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
              />
            </div>
          </div>

          <div className="p-3 bg-warning-50 border border-warning-200 rounded-md">
            <p className="text-xs text-warning-800">
              <User className="inline w-3.5 h-3.5 mr-1" aria-hidden="true" />
              Mang theo CMND/CCCD và sổ tiêm chủng (nếu có) khi đến tiêm.
            </p>
          </div>

          <button
            type="submit"
            className="w-full h-11 inline-flex items-center justify-center gap-2 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
          >
            <Check className="w-4 h-4" aria-hidden="true" />
            Xác nhận đặt lịch
          </button>
        </form>
      </div>
    </>
  );
}