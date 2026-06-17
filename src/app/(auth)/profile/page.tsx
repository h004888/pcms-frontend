// =====================================================
// /profile — CUST-PROFILE (polished)
// Edit mode với form + validation + save flow
// =====================================================

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { User, Mail, Phone, Calendar, Shield, Edit2, Save, X, Check, Heart, Award } from 'lucide-react';

interface Profile {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  tier: string;
  memberSince: string;
}

const INITIAL: Profile = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0901234567',
  birthday: '1990-05-15',
  gender: 'Nam',
  tier: 'Vàng',
  memberSince: '2023-08-12',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(INITIAL);
  const [draft, setDraft] = useState<Profile>(INITIAL);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Profile, string>>>({});

  const startEdit = () => {
    setDraft(profile);
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(profile);
    setErrors({});
    setEditing(false);
  };

  const validate = (data: Profile): Partial<Record<keyof Profile, string>> => {
    const e: Partial<Record<keyof Profile, string>> = {};
    if (!data.name.trim()) e.name = 'Họ tên không được để trống';
    else if (data.name.trim().length < 2) e.name = 'Họ tên quá ngắn';

    if (!data.email.trim()) e.email = 'Email không được để trống';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Email không hợp lệ';

    if (!data.phone.trim()) e.phone = 'Số điện thoại không được để trống';
    else if (!/^(0|\+84)[0-9]{9,10}$/.test(data.phone.replace(/\s/g, '')))
      e.phone = 'Số điện thoại không hợp lệ (VD: 0901234567)';

    if (!data.birthday) e.birthday = 'Vui lòng chọn ngày sinh';
    else {
      const age = (Date.now() - new Date(data.birthday).getTime()) / (365.25 * 86400000);
      if (age < 13) e.birthday = 'Phải từ 13 tuổi trở lên';
      if (age > 120) e.birthday = 'Ngày sinh không hợp lệ';
    }
    return e;
  };

  const save = () => {
    const e = validate(draft);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      toast.error('Vui lòng kiểm tra các trường có lỗi');
      return;
    }
    setProfile(draft);
    setEditing(false);
    setErrors({});
    toast.success('Đã cập nhật hồ sơ');
  };

  const updateField = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Hồ sơ' }]} />
          <div className="mt-3 flex items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-ink-900">Hồ sơ của tôi</h1>
            {!editing ? (
              <button
                type="button"
                onClick={startEdit}
                className="inline-flex items-center gap-1.5 px-3 h-9 text-xs font-semibold bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                Chỉnh sửa
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="inline-flex items-center gap-1 px-3 h-9 text-xs font-medium border border-ink-200 rounded-md hover:bg-ink-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                  Huỷ
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="inline-flex items-center gap-1 px-3 h-9 text-xs font-semibold bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" aria-hidden="true" />
                  Lưu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Avatar + tier */}
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center text-2xl font-bold text-accent-700">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-ink-900">{profile.name}</h2>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 h-5 bg-warning-100 text-warning-700 text-xs font-semibold rounded-full">
                  <Award className="w-3 h-3" aria-hidden="true" />
                  Thành viên {profile.tier}
                </span>
                <span className="text-xs text-ink-500 font-mono">
                  Từ {new Date(profile.memberSince).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Personal info — edit mode */}
        {editing ? (
          <section className="p-5 bg-white border border-ink-200 rounded-md space-y-4">
            <h2 className="text-base font-semibold text-ink-900 mb-1">Chỉnh sửa thông tin</h2>
            <FormField
              label="Họ tên *"
              error={errors.name}
            >
              <input
                type="text"
                value={draft.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={inputClass(!!errors.name)}
                placeholder="Nguyễn Văn A"
              />
            </FormField>

            <div className="grid sm:grid-cols-2 gap-3">
              <FormField label="Ngày sinh *" error={errors.birthday}>
                <input
                  type="date"
                  value={draft.birthday}
                  onChange={(e) => updateField('birthday', e.target.value)}
                  className={inputClass(!!errors.birthday)}
                />
              </FormField>
              <FormField label="Giới tính *">
                <select
                  value={draft.gender}
                  onChange={(e) => updateField('gender', e.target.value as Profile['gender'])}
                  className={inputClass(false)}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </FormField>
            </div>

            <FormField label="Email *" error={errors.email}>
              <input
                type="email"
                value={draft.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={inputClass(!!errors.email)}
                placeholder="email@example.com"
              />
            </FormField>

            <FormField label="Số điện thoại *" error={errors.phone}>
              <input
                type="tel"
                value={draft.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className={inputClass(!!errors.phone)}
                placeholder="0901234567"
              />
            </FormField>
          </section>
        ) : (
          <>
            <section className="p-5 bg-white border border-ink-200 rounded-md">
              <h2 className="text-base font-semibold text-ink-900 mb-4">Thông tin cá nhân</h2>
              <dl className="space-y-3 text-sm">
                <Row icon={User} label="Họ tên" value={profile.name} />
                <Row icon={Calendar} label="Ngày sinh" value={new Date(profile.birthday).toLocaleDateString('vi-VN')} />
                <Row icon={User} label="Giới tính" value={profile.gender} />
              </dl>
            </section>

            <section className="p-5 bg-white border border-ink-200 rounded-md">
              <h2 className="text-base font-semibold text-ink-900 mb-4">Liên lạc</h2>
              <dl className="space-y-3 text-sm">
                <Row icon={Mail} label="Email" value={profile.email} />
                <Row icon={Phone} label="Số điện thoại" value={profile.phone} />
              </dl>
            </section>
          </>
        )}

        {/* Security — always show */}
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-4">Bảo mật</h2>
          <ChangePasswordRow />
        </section>

        {/* Loyalty */}
        <section className="p-5 bg-gradient-to-br from-warning-50 to-accent-50 border border-warning-200 rounded-md">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-2">
            <Heart className="w-4 h-4 text-danger-500" aria-hidden="true" />
            Trở thành thành viên Bạch Kim
          </h2>
          <p className="text-sm text-ink-700 text-pretty">
            Còn <strong className="font-mono">2,420</strong> điểm nữa để lên hạng Bạch Kim — tận hưởng ưu đãi sinh nhật, free ship không giới hạn và dược sĩ riêng.
          </p>
          <a
            href="/points"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-700 hover:text-accent-800"
          >
            Xem điểm thưởng →
          </a>
        </section>
      </div>
    </>
  );
}

function inputClass(hasError: boolean): string {
  return [
    'w-full h-10 px-3 text-sm border rounded-md focus:outline-none focus:ring-2 font-mono',
    hasError
      ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-200'
      : 'border-ink-200 focus:border-accent-500 focus:ring-accent-200',
  ].join(' ');
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-ink-900 block mb-1">{label}</label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-danger-600 flex items-center gap-1">
          <X className="w-3 h-3" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-ink-400 flex-shrink-0" aria-hidden="true" />
      <dt className="w-32 flex-shrink-0 text-ink-500">{label}</dt>
      <dd className="font-medium text-ink-900">{value}</dd>
    </div>
  );
}

function ChangePasswordRow() {
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const submit = () => {
    if (!current) return toast.error('Vui lòng nhập mật khẩu hiện tại');
    if (next.length < 8) return toast.error('Mật khẩu mới phải có ít nhất 8 ký tự');
    if (next !== confirm) return toast.error('Mật khẩu xác nhận không khớp');
    toast.success('Đã đổi mật khẩu');
    setCurrent('');
    setNext('');
    setConfirm('');
    setEditing(false);
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="inline-flex items-center gap-2 px-4 h-10 text-sm font-medium border border-ink-200 rounded-md hover:bg-ink-50 transition-colors"
      >
        <Shield className="w-4 h-4" aria-hidden="true" />
        Đổi mật khẩu
      </button>
    );
  }

  return (
    <div className="space-y-3 max-w-md">
      <input
        type="password"
        placeholder="Mật khẩu hiện tại"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        className={inputClass(false)}
      />
      <input
        type="password"
        placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        className={inputClass(false)}
      />
      <input
        type="password"
        placeholder="Xác nhận mật khẩu mới"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className={inputClass(false)}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          className="inline-flex items-center gap-1 px-3 h-9 text-xs font-semibold bg-accent-600 text-white rounded-md hover:bg-accent-700"
        >
          <Check className="w-3.5 h-3.5" aria-hidden="true" />
          Cập nhật
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setCurrent('');
            setNext('');
            setConfirm('');
          }}
          className="inline-flex items-center gap-1 px-3 h-9 text-xs font-medium border border-ink-200 rounded-md hover:bg-ink-50"
        >
          Huỷ
        </button>
      </div>
    </div>
  );
}