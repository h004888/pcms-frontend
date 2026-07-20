import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  Search,
  RefreshCcw,
  Edit2,
  History,
  ToggleLeft,
  ToggleRight,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { StatusBadge } from '@shared/ui/StatusBadge.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import {
  listSuppliers,
  createSupplier,
  updateSupplier,
  getSupplierHistory,
} from '../api/supplierApi.js'

// ─── Supplier Form Modal ──────────────────────────────────────────────────────
function SupplierFormModal({ mode = 'create', initial = {}, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    taxCode: initial.taxCode || '',
    contactPerson: initial.contactPerson || '',
    phone: initial.phone || '',
    email: initial.email || '',
    address: initial.address || '',
    bankName: initial.bankName || '',
    bankAccount: initial.bankAccount || '',
    status: initial.status || 'ACTIVE',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  function setField(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Tên nhà cung cấp là bắt buộc'
    if (!form.taxCode.trim()) errs.taxCode = 'Mã số thuế là bắt buộc'
    if (!form.phone.trim()) errs.phone = 'Số điện thoại là bắt buộc'
    if (!form.email.trim()) errs.email = 'Email là bắt buộc'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSaving(true)
    try {
      if (mode === 'create') {
        await createSupplier(form)
        toast.success('Đã thêm nhà cung cấp thành công!')
      } else {
        await updateSupplier(initial.id, form)
        toast.success('Đã cập nhật nhà cung cấp thành công!')
      }
      onSuccess()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="supplier-form-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,29,61,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card" style={{ width: '100%', maxWidth: 640, maxHeight: '90vh', overflow: 'auto' }}>
        <div className="card-header">
          <h2 className="card-title" id="supplier-form-title">
            {mode === 'create' ? 'Thêm nhà cung cấp mới' : 'Cập nhật nhà cung cấp'}
          </h2>
          <button className="btn btn-ghost btn-icon" type="button" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <form className="card-body" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} noValidate>
          {/* Tên NCC */}
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label className="field-label" htmlFor="sup-name">Tên nhà cung cấp <span aria-hidden="true" style={{ color: 'var(--danger-500)' }}>*</span></label>
            <input id="sup-name" className={`input ${errors.name ? 'input-error' : ''}`} value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Công ty Dược phẩm ABC" />
            {errors.name && <p className="field-error" role="alert">{errors.name}</p>}
          </div>

          {/* Mã số thuế */}
          <div className="field">
            <label className="field-label" htmlFor="sup-tax">Mã số thuế <span aria-hidden="true" style={{ color: 'var(--danger-500)' }}>*</span></label>
            <input id="sup-tax" className={`input ${errors.taxCode ? 'input-error' : ''}`} value={form.taxCode} onChange={e => setField('taxCode', e.target.value)} placeholder="0123456789" disabled={mode === 'edit' && !!initial.taxCode} />
            {errors.taxCode && <p className="field-error" role="alert">{errors.taxCode}</p>}
          </div>

          {/* Người liên hệ */}
          <div className="field">
            <label className="field-label" htmlFor="sup-contact">Người liên hệ</label>
            <input id="sup-contact" className="input" value={form.contactPerson} onChange={e => setField('contactPerson', e.target.value)} placeholder="Nguyễn Văn A" />
          </div>

          {/* Phone */}
          <div className="field">
            <label className="field-label" htmlFor="sup-phone">Số điện thoại <span aria-hidden="true" style={{ color: 'var(--danger-500)' }}>*</span></label>
            <input id="sup-phone" type="tel" className={`input ${errors.phone ? 'input-error' : ''}`} value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="0901234567" />
            {errors.phone && <p className="field-error" role="alert">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div className="field">
            <label className="field-label" htmlFor="sup-email">Email <span aria-hidden="true" style={{ color: 'var(--danger-500)' }}>*</span></label>
            <input id="sup-email" type="email" className={`input ${errors.email ? 'input-error' : ''}`} value={form.email} onChange={e => setField('email', e.target.value)} placeholder="contact@abc.com" />
            {errors.email && <p className="field-error" role="alert">{errors.email}</p>}
          </div>

          {/* Địa chỉ */}
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label className="field-label" htmlFor="sup-addr">Địa chỉ</label>
            <input id="sup-addr" className="input" value={form.address} onChange={e => setField('address', e.target.value)} placeholder="123 Đường ABC, Quận 1, TP.HCM" />
          </div>

          {/* Ngân hàng */}
          <div className="field">
            <label className="field-label" htmlFor="sup-bank">Ngân hàng</label>
            <input id="sup-bank" className="input" value={form.bankName} onChange={e => setField('bankName', e.target.value)} placeholder="Vietcombank" />
          </div>

          {/* Số tài khoản */}
          <div className="field">
            <label className="field-label" htmlFor="sup-account">Số tài khoản</label>
            <input id="sup-account" className="input" value={form.bankAccount} onChange={e => setField('bankAccount', e.target.value)} placeholder="1234567890" />
          </div>

          {/* Status (edit only) */}
          {mode === 'edit' && (
            <div className="field">
              <label className="field-label" htmlFor="sup-status">Trạng thái</label>
              <select id="sup-status" className="select" value={form.status} onChange={e => setField('status', e.target.value)}>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Ngưng hoạt động</option>
              </select>
            </div>
          )}

          {/* Actions */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : mode === 'create' ? 'Thêm nhà cung cấp' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── History Modal ────────────────────────────────────────────────────────────
function HistoryModal({ supplierId, supplierName, onClose }) {
  const query = useQuery({
    queryKey: ['supplier-history', supplierId],
    queryFn: () => getSupplierHistory(supplierId),
  })

  const history = Array.isArray(query.data) ? query.data : []

  function formatDate(val) {
    if (!val) return '—'
    try { return new Date(val).toLocaleString('vi-VN') } catch { return val }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,29,61,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card" style={{ width: '100%', maxWidth: 520, maxHeight: '80vh', overflow: 'auto' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title" id="history-title">Lịch sử</h2>
            <p className="card-subtitle">{supplierName}</p>
          </div>
          <button className="btn btn-ghost btn-icon" type="button" onClick={onClose} aria-label="Đóng"><X size={18} /></button>
        </div>
        <div className="card-body">
          {query.isLoading ? (
            <div className="empty-state">Đang tải lịch sử...</div>
          ) : history.length === 0 ? (
            <div className="empty-state">Không có lịch sử nào.</div>
          ) : (
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 16 }}>
              {history.map((h, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--accent-100)', color: 'var(--accent-700)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontWeight: 700, fontSize: 13,
                  }}>{i + 1}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--ink-900)', fontSize: 14 }}>{h.action}</p>
                    <p style={{ margin: '2px 0 0', color: 'var(--ink-500)', fontSize: 13 }}>{h.description}</p>
                    <p style={{ margin: '2px 0 0', color: 'var(--ink-400)', fontSize: 12 }} className="mono">{formatDate(h.timestamp)}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function SupplierListPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [historyTarget, setHistoryTarget] = useState(null)
  const [page, setPage] = useState(0)

  const query = useQuery({
    queryKey: ['suppliers', appliedSearch, page],
    queryFn: () => listSuppliers({ search: appliedSearch || undefined, page, size: 20 }),
  })

  const suppliers = useMemo(() => {
    const data = query.data
    if (!data) return []
    if (Array.isArray(data)) return data
    if (Array.isArray(data.content)) return data.content
    if (Array.isArray(data.data)) return data.data
    return []
  }, [query.data])

  const totalPages = query.data?.totalPages ?? 0

  function handleFormClose() {
    setShowForm(false)
    setEditTarget(null)
  }

  function handleFormSuccess() {
    setShowForm(false)
    setEditTarget(null)
    queryClient.invalidateQueries({ queryKey: ['suppliers'] })
  }

  function handleSearch(e) {
    e.preventDefault()
    setAppliedSearch(search)
    setPage(0)
  }

  function handleToggleStatus(supplier) {
    const newStatus = supplier.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    updateSupplier(supplier.id, {
      name: supplier.name,
      taxCode: supplier.taxCode,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      bankName: supplier.bankName,
      bankAccount: supplier.bankAccount,
      status: newStatus,
    }).then(() => {
      toast.success(`Đã đổi trạng thái nhà cung cấp thành ${newStatus === 'ACTIVE' ? 'Hoạt động' : 'Ngưng hoạt động'}.`)
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    }).catch(e => toast.error(getApiErrorMessage(e)))
  }

  function formatDate(val) {
    if (!val) return '—'
    try { return new Date(val).toLocaleDateString('vi-VN') } catch { return val }
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        {/* Header */}
        <header className="page-header">
          <div>
            <p className="page-kicker">Quản lý</p>
            <h1 className="page-title">Nhà cung cấp</h1>
            <p className="page-description">
              Quản lý thông tin nhà cung cấp thuốc và vật tư y tế. Kiểm tra mã số thuế, trạng thái hoạt động và lịch sử.
            </p>
          </div>
          <button
            id="add-supplier-btn"
            className="btn btn-primary"
            type="button"
            onClick={() => { setEditTarget(null); setShowForm(true) }}
          >
            <Plus size={16} aria-hidden="true" />
            Thêm nhà cung cấp
          </button>
        </header>

        {/* Toolbar */}
        <form className="card card-body" onSubmit={handleSearch}
          style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, alignItems: 'end' }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="field-label" htmlFor="sup-search">Tìm kiếm</label>
            <input
              id="sup-search"
              className="input"
              placeholder="Tên hoặc mã số thuế..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'end' }}>
            <Search size={16} aria-hidden="true" /> Tìm kiếm
          </button>
          <button type="button" className="btn btn-ghost btn-icon" style={{ alignSelf: 'end' }}
            onClick={() => { setSearch(''); setAppliedSearch(''); setPage(0); query.refetch() }} title="Xóa bộ lọc">
            <RefreshCcw size={16} />
          </button>
        </form>

        {/* Table */}
        <section className="card" aria-labelledby="supplier-table-title">
          <div className="card-header">
            <h2 className="card-title" id="supplier-table-title">
              Danh sách nhà cung cấp
              {!query.isLoading && (
                <span style={{ marginLeft: 8, fontWeight: 400, color: 'var(--ink-500)', fontSize: 14 }}>
                  ({suppliers.length} mục)
                </span>
              )}
            </h2>
          </div>

          {query.isLoading ? (
            <div className="empty-state">Đang tải danh sách nhà cung cấp...</div>
          ) : query.isError ? (
            <div className="error-state" role="alert">{getApiErrorMessage(query.error)}</div>
          ) : suppliers.length === 0 ? (
            <div className="empty-state">
              {appliedSearch
                ? `Không tìm thấy nhà cung cấp nào với từ khóa "${appliedSearch}".`
                : 'Chưa có nhà cung cấp nào. Hãy thêm nhà cung cấp đầu tiên!'}
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tên nhà cung cấp</th>
                    <th>Mã số thuế</th>
                    <th>Người liên hệ</th>
                    <th>Điện thoại</th>
                    <th>Email</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th aria-label="Thao tác" />
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map(sup => (
                    <tr key={sup.id}>
                      <td>
                        <strong style={{ color: 'var(--ink-900)' }}>{sup.name}</strong>
                        {sup.address && (
                          <div className="card-subtitle" style={{ fontSize: 12, marginTop: 2 }}>{sup.address}</div>
                        )}
                      </td>
                      <td className="mono">{sup.taxCode}</td>
                      <td>{sup.contactPerson || '—'}</td>
                      <td className="mono">{sup.phone || '—'}</td>
                      <td>{sup.email || '—'}</td>
                      <td><StatusBadge status={sup.status} /></td>
                      <td className="mono">{formatDate(sup.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          {/* Edit */}
                          <button
                            className="btn btn-outline btn-icon"
                            type="button"
                            title="Chỉnh sửa"
                            aria-label={`Chỉnh sửa ${sup.name}`}
                            onClick={() => { setEditTarget(sup); setShowForm(true) }}
                          >
                            <Edit2 size={16} />
                          </button>
                          {/* Toggle status */}
                          <button
                            className="btn btn-outline btn-icon"
                            type="button"
                            title={sup.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            aria-label={sup.status === 'ACTIVE' ? `Vô hiệu hóa ${sup.name}` : `Kích hoạt ${sup.name}`}
                            onClick={() => handleToggleStatus(sup)}
                            style={{ color: sup.status === 'ACTIVE' ? 'var(--warning-700)' : 'var(--accent-700)' }}
                          >
                            {sup.status === 'ACTIVE' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                          </button>
                          {/* History */}
                          <button
                            className="btn btn-outline btn-icon"
                            type="button"
                            title="Xem lịch sử"
                            aria-label={`Lịch sử ${sup.name}`}
                            onClick={() => setHistoryTarget(sup)}
                          >
                            <History size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--ink-200)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" type="button" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Trước</button>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: 'var(--ink-500)' }}>
                Trang {page + 1} / {totalPages}
              </span>
              <button className="btn btn-outline" type="button" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Tiếp →</button>
            </div>
          )}
        </section>
      </div>

      {/* Modals */}
      {showForm && (
        <SupplierFormModal
          mode={editTarget ? 'edit' : 'create'}
          initial={editTarget || {}}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
      {historyTarget && (
        <HistoryModal
          supplierId={historyTarget.id}
          supplierName={historyTarget.name}
          onClose={() => setHistoryTarget(null)}
        />
      )}
    </DashboardLayout>
  )
}
