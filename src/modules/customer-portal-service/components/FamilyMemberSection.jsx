import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import {
  listFamilyMembers,
  createFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
} from '../api/shopApi.js'

const emptyForm = {
  memberName: '',
  relationship: '',
  dob: '',
  gender: '',
  allergies: '',
  chronicConditions: '',
}

const relationshipLabels = {
  SPOUSE: 'Vợ/Chồng',
  CHILD: 'Con',
  PARENT: 'Cha/Mẹ',
  SIBLING: 'Anh/Chị/Em',
  OTHER: 'Khác',
}

export function FamilyMemberSection() {
  const queryClient = useQueryClient()
  const [editingMember, setEditingMember] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const listQuery = useQuery({
    queryKey: ['family-members'],
    queryFn: listFamilyMembers,
  })

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      id ? updateFamilyMember(id, payload) : createFamilyMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members'] })
      setEditingMember(null)
      setIsFormOpen(false)
      setForm(emptyForm)
      toast.success('Đã lưu thành viên gia đình')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteFamilyMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members'] })
      toast.success('Đã xóa thành viên gia đình')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const validate = () => {
    const errs = {}
    if (!form.memberName.trim()) errs.memberName = 'Tên không được để trống.'
    if (form.memberName.trim().length > 100) errs.memberName = 'Tối đa 100 ký tự.'
    if (!form.relationship.trim()) errs.relationship = 'Quan hệ không được để trống.'
    if (form.relationship.trim().length > 50) errs.relationship = 'Tối đa 50 ký tự.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submitForm = (event) => {
    event.preventDefault()
    if (!validate()) return
    saveMutation.mutate({
      id: editingMember?.id,
      payload: {
        memberName: form.memberName.trim(),
        relationship: form.relationship.trim(),
        dob: form.dob || null,
        gender: form.gender || null,
        allergies: form.allergies
          ? form.allergies.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        chronicConditions: form.chronicConditions
          ? form.chronicConditions.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      },
    })
  }

  const openCreate = () => {
    setEditingMember(null)
    setIsFormOpen(true)
    setForm(emptyForm)
    setErrors({})
  }

  const openEdit = (member) => {
    setEditingMember(member)
    setIsFormOpen(true)
    setForm({
      memberName: member.memberName || '',
      relationship: member.relationship || '',
      dob: member.dob || '',
      gender: member.gender || '',
      allergies: (member.allergies || []).join(', '),
      chronicConditions: (member.chronicConditions || []).join(', '),
    })
    setErrors({})
  }

  const closeForm = () => {
    setEditingMember(null)
    setIsFormOpen(false)
    setForm(emptyForm)
    setErrors({})
  }

  const renderInput = (label, field, opts = {}) => (
    <label className="block">
      <span className="block text-sm font-medium text-[var(--shop-text)] mb-1">{label}</span>
      <input
        {...opts}
        value={form[field]}
        onChange={(e) => setForm((c) => ({ ...c, [field]: e.target.value }))}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--shop-primary)] focus:outline-none"
      />
      {errors[field] && <span className="mt-1 block text-xs text-red-600">{errors[field]}</span>}
    </label>
  )

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold text-[var(--shop-text)]">Thành viên gia đình</h2>
        <button type="button" onClick={openCreate} className="rounded-lg border border-[var(--shop-primary)] px-4 py-2 text-sm font-semibold text-[var(--shop-primary)]">
          Thêm thành viên
        </button>
      </div>
      {listQuery.isLoading && <p className="text-[var(--shop-text-secondary)]">Đang tải...</p>}
      {listQuery.isError && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{getApiErrorMessage(listQuery.error)}</p>}
      {listQuery.data && listQuery.data.length === 0 && (
        <p className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-[var(--shop-text-secondary)]">Chưa có thành viên gia đình.</p>
      )}
      <div className="space-y-3">
        {listQuery.data?.map((member) => (
          <article key={member.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <strong className="text-[var(--shop-text)]">{member.memberName}</strong>
              <span className="rounded-full bg-[var(--shop-primary-light)] px-2 py-0.5 text-xs text-[var(--shop-primary)]">
                {relationshipLabels[member.relationship] || member.relationship}
              </span>
              {member.gender && (
                <span className="text-sm text-[var(--shop-text-secondary)]">
                  {member.gender === 'MALE' ? 'Nam' : member.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                </span>
              )}
              {member.dob && <span className="text-sm text-[var(--shop-text-secondary)]">{member.dob}</span>}
            </div>
            {member.allergies && member.allergies.length > 0 && (
              <p className="mt-2 text-sm text-[var(--shop-text-secondary)]">
                <span className="font-medium">Dị ứng:</span> {member.allergies.join(', ')}
              </p>
            )}
            {member.chronicConditions && member.chronicConditions.length > 0 && (
              <p className="mt-1 text-sm text-[var(--shop-text-secondary)]">
                <span className="font-medium">Bệnh mãn tính:</span> {member.chronicConditions.join(', ')}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium">
              <button type="button" onClick={() => openEdit(member)} className="text-[var(--shop-primary)]">Sửa</button>
              <button type="button" disabled={deleteMutation.isPending} onClick={() => { if (window.confirm('Bạn có chắc muốn xóa thành viên này?')) deleteMutation.mutate(member.id) }} className="text-red-600 disabled:opacity-60">Xóa</button>
            </div>
          </article>
        ))}
      </div>
      {isFormOpen && (
        <form onSubmit={submitForm} className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-[var(--shop-text)]">{editingMember ? 'Sửa thành viên' : 'Thêm thành viên'}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {renderInput('Tên thành viên', 'memberName')}
            <label className="block">
              <span className="block text-sm font-medium text-[var(--shop-text)] mb-1">Quan hệ</span>
              <select value={form.relationship} onChange={(e) => setForm((c) => ({ ...c, relationship: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--shop-primary)] focus:outline-none">
                <option value="">Chọn quan hệ</option>
                <option value="SPOUSE">Vợ/Chồng</option>
                <option value="CHILD">Con</option>
                <option value="PARENT">Cha/Mẹ</option>
                <option value="SIBLING">Anh/Chị/Em</option>
                <option value="OTHER">Khác</option>
              </select>
              {errors.relationship && <span className="mt-1 block text-xs text-red-600">{errors.relationship}</span>}
            </label>
            {renderInput('Ngày sinh', 'dob', { type: 'date' })}
            <label className="block">
              <span className="block text-sm font-medium text-[var(--shop-text)] mb-1">Giới tính</span>
              <select value={form.gender} onChange={(e) => setForm((c) => ({ ...c, gender: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--shop-primary)] focus:outline-none">
                <option value="">Chọn giới tính</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </label>
            {renderInput('Dị ứng (cách nhau bằng dấu phẩy)', 'allergies')}
            {renderInput('Bệnh mãn tính (cách nhau bằng dấu phẩy)', 'chronicConditions')}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saveMutation.isPending} style={{ backgroundColor: '#2563EB' }} className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {saveMutation.isPending ? 'Đang lưu...' : 'Lưu thành viên'}
            </button>
            <button type="button" onClick={closeForm} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-[var(--shop-text)]">Hủy</button>
          </div>
        </form>
      )}
    </section>
  )
}
