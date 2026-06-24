// =====================================================
// /tiem-chung/dat-lich — VACCINE-BOOKING (real API)
// Đặt lịch tiêm vaccine — gọi /api/v1/vaccines + /vaccine-bookings
// =====================================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import {
  Calendar,
  MapPin,
  User,
  Check,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchVaccines,
  fetchVaccineSlots,
  bookVaccine,
} from '@/features/vaccines';
import type { Vaccine, VaccineSlot } from '@/features/vaccines';
import { fetchStores } from '@/features/stores';
import type { StoreLocation } from '@/features/stores';

export default function DatLichTiemPage() {
  const router = useRouter();
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [slots, setSlots] = useState<VaccineSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [vaccineId, setVaccineId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [slotId, setSlotId] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchVaccines(), fetchStores()])
      .then(([vRes, sRes]) => {
        if (cancelled) return;
        setVaccines(vRes.vaccines);
        setStores(sRes.stores);
        if (vRes.vaccines[0]) setVaccineId(vRes.vaccines[0].id);
        if (sRes.stores[0]) setStoreId(sRes.stores[0].id);
      })
      .catch(() => {
        toast.error('Không thể tải dữ liệu vaccine');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!vaccineId) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    fetchVaccineSlots(vaccineId)
      .then((res) => {
        if (!cancelled) {
          setSlots(res.slots);
          if (res.slots[0]) setSlotId(res.slots[0].id);
        }
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      });
    return () => {
      cancelled = true;
    };
  }, [vaccineId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vaccineId || !slotId || !name || !phone || !date) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setSubmitting(true);
    try {
      const booking = await bookVaccine({
        vaccineId,
        slotId,
      });
      toast.success(
        `Đặt lịch thành công! Mã booking: ${booking.id.slice(0, 8).toUpperCase()}`
      );
      router.push('/tiem-chung/so-tiem');
    } catch (err) {
      toast.error('Đặt lịch thất bại, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-sm text-ink-500">
        <Loader2 className="inline w-4 h-4 animate-spin mr-2" />
        Đang tải dữ liệu vaccine...
      </div>
    );
  }

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
            Chọn vaccine, nhà thuốc và khung giờ. Nhân viên sẽ gọi xác nhận.
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
              Chọn vaccine
            </legend>
            <div className="space-y-2">
              {vaccines.map((v) => (
                <label
                  key={v.id}
                  className="flex items-center justify-between gap-3 p-3 border border-ink-200 rounded-md cursor-pointer hover:border-accent-500 has-[:checked]:border-accent-600 has-[:checked]:bg-accent-50"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="vaccine"
                      checked={vaccineId === v.id}
                      onChange={() => setVaccineId(v.id)}
                      className="w-4 h-4 text-accent-600 focus:ring-accent-500"
                    />
                    <span className="text-sm font-medium text-ink-900">
                      {v.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold font-mono text-accent-700">
                    {v.price === 0
                      ? 'Miễn phí'
                      : `${v.price.toLocaleString('vi-VN')} ₫`}
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
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.address}
                </option>
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
              <div className="mt-1 grid grid-cols-3 gap-1">
                {slots.length === 0 ? (
                  <p className="col-span-3 text-xs text-ink-500 py-2 text-center">
                    Không có khung giờ khả dụng
                  </p>
                ) : (
                  slots.map((s) => {
                    const start = new Date(s.startTime);
                    const label = `${start.getHours().toString().padStart(2, '0')}:${start
                      .getMinutes()
                      .toString()
                      .padStart(2, '0')}`;
                    return (
                      <label
                        key={s.id}
                        className="flex items-center justify-center h-10 text-xs font-mono border border-ink-200 rounded-md cursor-pointer hover:border-accent-500 has-[:checked]:border-accent-600 has-[:checked]:bg-accent-50"
                      >
                        <input
                          type="radio"
                          name="slot"
                          checked={slotId === s.id}
                          onChange={() => setSlotId(s.id)}
                          className="sr-only"
                        />
                        <span className="text-ink-700">{label}</span>
                      </label>
                    );
                  })
                )}
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
                required
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
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
                required
                placeholder="0901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            disabled={submitting}
            className="w-full h-11 inline-flex items-center justify-center gap-2 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors disabled:bg-ink-300"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" aria-hidden="true" />
            )}
            {submitting ? 'Đang đặt lịch...' : 'Xác nhận đặt lịch'}
          </button>
        </form>
      </div>
    </>
  );
}