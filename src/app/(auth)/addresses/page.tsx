// =====================================================
// /addresses — CUST-ADDRESS (polished)
// Full CRUD với add/edit/delete + set default
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { MapPin, Plus, Home, Briefcase, Star, Edit2, Trash2, X, Save, Check } from 'lucide-react';
import { fetchAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/features/addresses';
import type { Address } from '@/features/addresses';

const LABEL_ICONS = { 'Nhà': Home, 'Công ty': Briefcase, 'Khác': MapPin };

export default function AddressesPage() {
  const [list, setList] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<Address | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});

  useEffect(() => {
    fetchAddresses()
      .then(setList)
      .catch(() => toast.error('Không tải được danh sách địa chỉ'))
      .finally(() => setLoading(false));
  }, []);

  const empty: Address = {
    id: '',
    label: 'Nhà',
    name: '',
    phone: '',
    line: '',
    province: '',
    isDefault: false,
  };

  const startNew = () => {
    setDraft({ ...empty, id: `addr-${Date.now()}` });
    setErrors({});
    setEditingId('new');
  };

  const startEdit = (a: Address) => {
    setDraft({ ...a });
    setErrors({});
    setEditingId(a.id);
  };

  const cancel = () => {
    setEditingId(null);
    setDraft(null);
    setErrors({});
  };

  const validate = (d: Address) => {
    const e: Partial<Record<keyof Address, string>> = {};
    if (!d.name.trim()) e.name = 'Vui lòng nhập họ tên';
    if (!d.phone.trim()) e.phone = 'Vui lòng nhập SĐT';
    else if (!/^(0|\+84)[0-9]{9,10}$/.test(d.phone.replace(/\s/g, '')))
      e.phone = 'SĐT không hợp lệ';
    if (!d.line.trim()) e.line = 'Vui lòng nhập địa chỉ';
    if (!d.province.trim()) e.province = 'Vui lòng nhập tỉnh/TP';
    return e;
  };

  const save = async () => {
    if (!draft) return;
    const e = validate(draft);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      toast.error('Vui lòng kiểm tra các trường có lỗi');
      return;
    }

    try {
      if (editingId === 'new') {
        const newAddr = await createAddress(draft);
        setList((prev) => {
          let next = [...prev];
          if (newAddr.isDefault) {
            next = next.map((a) => ({ ...a, isDefault: false }));
          }
          return [...next, newAddr];
        });
        toast.success('Đã thêm địa chỉ');
      } else {
        const updated = await updateAddress(draft.id, draft);
        setList((prev) => {
          let next = prev.map((a) => (a.id === updated.id ? updated : a));
          if (updated.isDefault) {
            next = next.map((a) => ({ ...a, isDefault: a.id === updated.id }));
          }
          return next;
        });
        toast.success('Đã cập nhật địa chỉ');
      }
      cancel();
    } catch {
      toast.error('Không lưu được địa chỉ');
    }
  };

  const remove = async (id: string) => {
    const a = list.find((x) => x.id === id);
    if (!a) return;
    if (!window.confirm(`Xóa địa chỉ "${a.line}"?`)) return;
    try {
      await deleteAddress(id);
      setList((prev) => prev.filter((x) => x.id !== id));
      toast.success('Đã xóa địa chỉ');
    } catch {
      toast.error('Không xóa được địa chỉ');
    }
  };

  const setDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      setList((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
      toast.success('Đã đặt làm mặc định');
    } catch {
      toast.error('Không đặt được mặc định');
    }
  };

  if (loading) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Sổ địa chỉ' }]} />
        <h1 className="mt-3 text-xl font-bold text-ink-900">Sổ địa chỉ</h1>
        <p className="text-sm text-ink-600 mt-2">Đang tải...</p>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Sổ địa chỉ' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Sổ địa chỉ</h1>
          <p className="text-sm text-ink-600 font-mono mt-0.5">{list.length} địa chỉ</p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-1.5 px-3 h-9 bg-accent-600 text-white text-xs font-semibold rounded-md hover:bg-accent-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          Thêm
        </button>
      </div>

      {list.length === 0 && !editingId ? (
        <div className="p-5 bg-white border border-ink-200 rounded-md text-center">
          <MapPin className="w-12 h-12 mx-auto text-ink-300" aria-hidden="true" />
          <p className="mt-2 text-sm text-ink-600">Chưa có địa chỉ nào</p>
          <button
            type="button"
            onClick={startNew}
            className="mt-3 inline-flex items-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={() => startEdit(addr)}
              onDelete={() => remove(addr.id)}
              onSetDefault={() => setDefault(addr.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {editingId && draft && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="addr-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) cancel();
          }}
        >
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-ink-200">
              <h2 id="addr-modal-title" className="text-base font-semibold text-ink-900">
                {editingId === 'new' ? 'Thêm địa chỉ' : 'Sửa địa chỉ'}
              </h2>
              <button
                type="button"
                onClick={cancel}
                aria-label="Đóng"
                className="p-1 text-ink-400 hover:text-ink-700 rounded"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              <Field label="Nhãn *" error={errors.label}>
                <div className="flex gap-2">
                  {(['Nhà', 'Công ty', 'Khác'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setDraft({ ...draft, label: l })}
                      className={`flex-1 h-9 text-sm rounded-md border transition-colors ${
                        draft.label === l
                          ? 'bg-accent-50 border-accent-600 text-accent-700 font-semibold'
                          : 'bg-white border-ink-200 text-ink-700 hover:border-ink-300'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Họ tên *" error={errors.name}>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className={inputClass(!!errors.name)}
                  placeholder="Nguyễn Văn A"
                />
              </Field>

              <Field label="Số điện thoại *" error={errors.phone}>
                <input
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                  className={inputClass(!!errors.phone)}
                  placeholder="0901234567"
                />
              </Field>

              <Field label="Địa chỉ *" error={errors.line}>
                <input
                  type="text"
                  value={draft.line}
                  onChange={(e) => setDraft({ ...draft, line: e.target.value })}
                  className={inputClass(!!errors.line)}
                  placeholder="Số nhà, đường, phường/xã"
                />
              </Field>

              <Field label="Tỉnh/TP *" error={errors.province}>
                <input
                  type="text"
                  value={draft.province}
                  onChange={(e) => setDraft({ ...draft, province: e.target.value })}
                  className={inputClass(!!errors.province)}
                  placeholder="Quận 1, TP. Hồ Chí Minh"
                />
              </Field>

              <label className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={draft.isDefault}
                  onChange={(e) => setDraft({ ...draft, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded text-accent-600 focus:ring-accent-500"
                />
                <span className="text-sm text-ink-900">Đặt làm địa chỉ mặc định</span>
              </label>
            </div>

            <div className="flex gap-2 p-4 border-t border-ink-200">
              <button
                type="button"
                onClick={cancel}
                className="flex-1 h-10 text-sm font-medium border border-ink-200 rounded-md hover:bg-ink-50"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={save}
                className="flex-1 h-10 inline-flex items-center justify-center gap-1 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700"
              >
                <Save className="w-4 h-4" aria-hidden="true" />
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  const Icon = LABEL_ICONS[address.label];
  return (
    <article className="p-4 bg-white border border-ink-200 rounded-md">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-ink-50 rounded-md flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-ink-600" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 h-5 bg-ink-100 text-ink-700 text-xs font-medium rounded">
              {address.label}
            </span>
            {address.isDefault && (
              <span className="inline-flex items-center gap-1 px-2 h-5 bg-accent-100 text-accent-700 text-xs font-semibold rounded">
                <Star className="w-3 h-3 fill-accent-700" aria-hidden="true" />
                Mặc định
              </span>
            )}
          </div>
          <p className="mt-1 text-sm font-medium text-ink-900">{address.name}</p>
          <p className="text-xs text-ink-500 font-mono">{address.phone}</p>
          <p className="mt-1 text-sm text-ink-700 text-pretty">
            {address.line}, {address.province}
          </p>
          <div className="mt-3 flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1 text-xs font-medium text-accent-700 hover:text-accent-800"
            >
              <Edit2 className="w-3 h-3" aria-hidden="true" />
              Sửa
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1 text-xs font-medium text-danger-600 hover:text-danger-700"
            >
              <Trash2 className="w-3 h-3" aria-hidden="true" />
              Xóa
            </button>
            {!address.isDefault && (
              <button
                type="button"
                onClick={onSetDefault}
                className="inline-flex items-center gap-1 text-xs font-medium text-ink-700 hover:text-ink-900"
              >
                <Check className="w-3 h-3" aria-hidden="true" />
                Đặt mặc định
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Field({
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

function inputClass(hasError: boolean): string {
  return [
    'w-full h-10 px-3 text-sm border rounded-md focus:outline-none focus:ring-2 font-mono',
    hasError
      ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-200'
      : 'border-ink-200 focus:border-accent-500 focus:ring-accent-200',
  ].join(' ');
}
