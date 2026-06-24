// =====================================================
// /family — CUST-FAMILY (polished)
// Full CRUD cho family members + allergies/conditions
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Users, Plus, User, Cake, AlertTriangle, Edit2, Trash2, X, Save } from 'lucide-react';
import { fetchFamilyMembers, createFamilyMember, updateFamilyMember, deleteFamilyMember } from '@/features/family';
import type { FamilyMember } from '@/features/family';

const RELATIONS = ['Bản thân', 'Vợ', 'Chồng', 'Con trai', 'Con gái', 'Bố', 'Mẹ', 'Anh', 'Chị', 'Em', 'Ông', 'Bà', 'Khác'];

const empty: FamilyMember = {
  id: '',
  name: '',
  relation: 'Con trai',
  birthYear: new Date().getFullYear() - 5,
  allergies: [],
  conditions: [],
};

export default function FamilyPage() {
  const [list, setList] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<FamilyMember | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FamilyMember, string>>>({});
  const [allergyInput, setAllergyInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');

  useEffect(() => {
    fetchFamilyMembers()
      .then(setList)
      .catch(() => toast.error('Không tải được danh sách thành viên'))
      .finally(() => setLoading(false));
  }, []);

  const startNew = () => {
    setDraft({ ...empty, id: `fm-${Date.now()}` });
    setErrors({});
    setAllergyInput('');
    setConditionInput('');
    setEditingId('new');
  };

  const startEdit = (m: FamilyMember) => {
    setDraft({ ...m });
    setErrors({});
    setAllergyInput('');
    setConditionInput('');
    setEditingId(m.id);
  };

  const cancel = () => {
    setEditingId(null);
    setDraft(null);
    setErrors({});
  };

  const validate = (d: FamilyMember) => {
    const e: Partial<Record<keyof FamilyMember, string>> = {};
    if (!d.name.trim()) e.name = 'Vui lòng nhập họ tên';
    const currentYear = new Date().getFullYear();
    if (d.birthYear < 1900 || d.birthYear > currentYear)
      e.birthYear = `Năm sinh phải từ 1900 đến ${currentYear}`;
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
        const created = await createFamilyMember(draft);
        setList((prev) => [...prev, created]);
        toast.success('Đã thêm thành viên');
      } else {
        const updated = await updateFamilyMember(draft.id, draft);
        setList((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        toast.success('Đã cập nhật hồ sơ');
      }
      cancel();
    } catch {
      toast.error('Không lưu được hồ sơ');
    }
  };

  const remove = async (id: string) => {
    const m = list.find((x) => x.id === id);
    if (!m) return;
    if (!window.confirm(`Xóa hồ sơ "${m.name}"?`)) return;
    try {
      await deleteFamilyMember(id);
      setList((prev) => prev.filter((x) => x.id !== id));
      toast.success('Đã xóa thành viên');
    } catch {
      toast.error('Không xóa được thành viên');
    }
  };

  const addAllergy = () => {
    const v = allergyInput.trim();
    if (!v || !draft) return;
    if (draft.allergies.includes(v)) {
      toast.error('Dị ứng này đã có');
      return;
    }
    setDraft({ ...draft, allergies: [...draft.allergies, v] });
    setAllergyInput('');
  };

  const removeAllergy = (a: string) => {
    if (!draft) return;
    setDraft({ ...draft, allergies: draft.allergies.filter((x) => x !== a) });
  };

  const addCondition = () => {
    const v = conditionInput.trim();
    if (!v || !draft) return;
    if (draft.conditions.includes(v)) {
      toast.error('Bệnh nền này đã có');
      return;
    }
    setDraft({ ...draft, conditions: [...draft.conditions, v] });
    setConditionInput('');
  };

  const removeCondition = (c: string) => {
    if (!draft) return;
    setDraft({ ...draft, conditions: draft.conditions.filter((x) => x !== c) });
  };

  if (loading) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Hồ sơ gia đình' }]} />
        <h1 className="mt-3 text-xl font-bold text-ink-900">Hồ sơ gia đình</h1>
        <p className="text-sm text-ink-600 mt-2">Đang tải...</p>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Hồ sơ gia đình' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Hồ sơ gia đình</h1>
          <p className="text-sm text-ink-600 mt-1 font-mono">{list.length} thành viên</p>
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
          <Users className="w-12 h-12 mx-auto text-ink-300" aria-hidden="true" />
          <p className="mt-2 text-sm text-ink-600">Chưa có thành viên nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((m) => (
            <article key={m.id} className="p-4 bg-white border border-ink-200 rounded-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-accent-700" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900">{m.name}</p>
                  <div className="mt-1 flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-2 h-5 bg-ink-100 text-ink-700 rounded">{m.relation}</span>
                    <span className="inline-flex items-center gap-1 text-ink-500 font-mono">
                      <Cake className="w-3 h-3" aria-hidden="true" />
                      {m.birthYear}
                    </span>
                  </div>
                  {m.allergies.length > 0 && (
                    <div className="mt-2 p-2 bg-danger-50 border border-danger-200 rounded text-xs text-danger-800">
                      <strong className="font-semibold">Dị ứng:</strong> {m.allergies.join(', ')}
                    </div>
                  )}
                  {m.conditions.length > 0 && (
                    <div className="mt-2 p-2 bg-warning-50 border border-warning-200 rounded text-xs text-warning-800">
                      <AlertTriangle className="inline w-3.5 h-3.5 mr-1" aria-hidden="true" />
                      <strong className="font-semibold">Bệnh nền:</strong> {m.conditions.join(', ')}
                    </div>
                  )}
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(m)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-accent-700"
                    >
                      <Edit2 className="w-3 h-3" aria-hidden="true" />
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(m.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-danger-600"
                    >
                      <Trash2 className="w-3 h-3" aria-hidden="true" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingId && draft && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fm-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) cancel();
          }}
        >
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-ink-200">
              <h2 id="fm-modal-title" className="text-base font-semibold text-ink-900">
                {editingId === 'new' ? 'Thêm thành viên' : 'Sửa hồ sơ'}
              </h2>
              <button type="button" onClick={cancel} aria-label="Đóng" className="p-1 text-ink-400 hover:text-ink-700 rounded">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              <Field label="Họ tên *" error={errors.name}>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className={inputClass(!!errors.name)}
                />
              </Field>

              <Field label="Quan hệ *">
                <select
                  value={draft.relation}
                  onChange={(e) => setDraft({ ...draft, relation: e.target.value })}
                  className={inputClass(false)}
                >
                  {RELATIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Năm sinh *" error={errors.birthYear}>
                <input
                  type="number"
                  value={draft.birthYear}
                  onChange={(e) =>
                    setDraft({ ...draft, birthYear: Number(e.target.value) || 0 })
                  }
                  min={1900}
                  max={new Date().getFullYear()}
                  className={inputClass(!!errors.birthYear)}
                />
              </Field>

              <Field label="Dị ứng">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addAllergy();
                      }
                    }}
                    className="flex-1 h-9 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
                    placeholder="VD: Penicillin, phấn hoa..."
                  />
                  <button
                    type="button"
                    onClick={addAllergy}
                    className="px-3 h-9 text-xs font-medium bg-ink-100 text-ink-700 rounded-md hover:bg-ink-200"
                  >
                    Thêm
                  </button>
                </div>
                {draft.allergies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {draft.allergies.map((a) => (
                      <span
                        key={a}
                        className="inline-flex items-center gap-1 px-2 h-6 bg-danger-100 text-danger-800 text-xs font-medium rounded-full"
                      >
                        {a}
                        <button
                          type="button"
                          onClick={() => removeAllergy(a)}
                          aria-label={`Xóa dị ứng ${a}`}
                          className="hover:text-danger-900"
                        >
                          <X className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </Field>

              <Field label="Bệnh nền">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={conditionInput}
                    onChange={(e) => setConditionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCondition();
                      }
                    }}
                    className="flex-1 h-9 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
                    placeholder="VD: Tiểu đường, cao huyết áp..."
                  />
                  <button
                    type="button"
                    onClick={addCondition}
                    className="px-3 h-9 text-xs font-medium bg-ink-100 text-ink-700 rounded-md hover:bg-ink-200"
                  >
                    Thêm
                  </button>
                </div>
                {draft.conditions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {draft.conditions.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 px-2 h-6 bg-warning-100 text-warning-800 text-xs font-medium rounded-full"
                      >
                        {c}
                        <button
                          type="button"
                          onClick={() => removeCondition(c)}
                          aria-label={`Xóa bệnh nền ${c}`}
                          className="hover:text-warning-900"
                        >
                          <X className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </Field>
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
