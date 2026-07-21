import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  Search,
  RefreshCcw,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Printer,
  X,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import {
  listPrescriptions,
  createPrescription,
  savePrescriptionDraft,
  signPrescription,
  cancelPrescription,
  printPrescription,
} from '../api/prescriptionApi.js'

// ─── Status Badge ─────────────────────────────────────────────────────────────
function PrescriptionStatusBadge({ status }) {
  const map = {
    DRAFT: { cls: 'badge-muted', label: 'Nháp' },
    SIGNED: { cls: 'badge-success', label: 'Đã ký' },
    CANCELLED: { cls: 'badge-danger', label: 'Đã hủy' },
  }
  const { cls, label } = map[status] || { cls: 'badge-muted', label: status }
  return <span className={`badge ${cls}`}>{label}</span>
}

// ─── Create Prescription Modal ────────────────────────────────────────────────
function PrescriptionFormModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    diagnosis: '',
    notes: '',
    licenseNo: '',
    items: [{ medicineId: '', quantity: 1, dosage: '', instructions: '' }],
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [mode, setMode] = useState('signed') // 'draft' | 'signed'

  function setField(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  function addItem() {
    setForm(f => ({ ...f, items: [...f.items, { medicineId: '', quantity: 1, dosage: '', instructions: '' }] }))
  }

  function removeItem(i) {
    setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }))
  }

  function updateItem(i, key, val) {
    setForm(f => ({
      ...f,
      items: f.items.map((item, idx) => idx === i ? { ...item, [key]: val } : item),
    }))
  }

  function validate() {
    const errs = {}
    if (!form.patientId.trim()) errs.patientId = 'Mã bệnh nhân là bắt buộc'
    if (!form.doctorId.trim()) errs.doctorId = 'Mã bác sĩ/dược sĩ là bắt buộc'
    if (!form.diagnosis.trim()) errs.diagnosis = 'Chẩn đoán là bắt buộc'
    if (!form.licenseNo.trim()) errs.licenseNo = 'Số giấy phép là bắt buộc'
    if (form.items.length === 0) errs.items = 'Phải có ít nhất một dòng thuốc'
    return errs
  }

  async function handleSubmit(e, submitMode) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSaving(true)
    try {
      const payload = { ...form, saveAsDraft: submitMode === 'draft' }
      if (submitMode === 'draft') {
        await savePrescriptionDraft(payload)
        toast.success('Đã lưu đơn thuốc nháp!')
      } else {
        await createPrescription(payload)
        toast.success('Đã tạo và ký đơn thuốc thành công! Mã đơn được tự sinh (RX-2026xxxx)')
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
      role="dialog" aria-modal="true" aria-labelledby="rx-form-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,29,61,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, overflowY: 'auto',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card" style={{ width: '100%', maxWidth: 720, maxHeight: '95vh', overflowY: 'auto' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title" id="rx-form-title">Tạo đơn thuốc mới</h2>
            <p className="card-subtitle">Mã đơn sẽ được tự động sinh: <strong className="mono">RX-2026xxxx</strong></p>
          </div>
          <button className="btn btn-ghost btn-icon" type="button" onClick={onClose} aria-label="Đóng"><X size={18} /></button>
        </div>

        <form className="card-body" style={{ display: 'grid', gap: 16 }} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Patient */}
            <div className="field">
              <label className="field-label" htmlFor="rx-patient">ID Bệnh nhân <span style={{ color: 'var(--danger-500)' }}>*</span></label>
              <input id="rx-patient" className={`input ${errors.patientId ? 'input-error' : ''}`}
                placeholder="UUID bệnh nhân" value={form.patientId} onChange={e => setField('patientId', e.target.value)} />
              {errors.patientId && <p className="field-error" role="alert">{errors.patientId}</p>}
            </div>

            {/* Doctor */}
            <div className="field">
              <label className="field-label" htmlFor="rx-doctor">ID Dược sĩ/Bác sĩ <span style={{ color: 'var(--danger-500)' }}>*</span></label>
              <input id="rx-doctor" className={`input ${errors.doctorId ? 'input-error' : ''}`}
                placeholder="UUID dược sĩ" value={form.doctorId} onChange={e => setField('doctorId', e.target.value)} />
              {errors.doctorId && <p className="field-error" role="alert">{errors.doctorId}</p>}
            </div>

            {/* Diagnosis */}
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label className="field-label" htmlFor="rx-diag">Chẩn đoán <span style={{ color: 'var(--danger-500)' }}>*</span></label>
              <textarea id="rx-diag" className={`textarea ${errors.diagnosis ? 'input-error' : ''}`} rows={2}
                placeholder="Viêm họng cấp, sốt, ..." value={form.diagnosis} onChange={e => setField('diagnosis', e.target.value)} />
              {errors.diagnosis && <p className="field-error" role="alert">{errors.diagnosis}</p>}
            </div>

            {/* License */}
            <div className="field">
              <label className="field-label" htmlFor="rx-license">Số giấy phép hành nghề <span style={{ color: 'var(--danger-500)' }}>*</span></label>
              <input id="rx-license" className={`input ${errors.licenseNo ? 'input-error' : ''}`}
                placeholder="GP-2026-001234" value={form.licenseNo} onChange={e => setField('licenseNo', e.target.value)} />
              {errors.licenseNo && <p className="field-error" role="alert">{errors.licenseNo}</p>}
            </div>

            {/* Notes */}
            <div className="field">
              <label className="field-label" htmlFor="rx-notes">Ghi chú</label>
              <textarea id="rx-notes" className="textarea" rows={2}
                placeholder="Dặn dò bệnh nhân..." value={form.notes} onChange={e => setField('notes', e.target.value)} />
            </div>
          </div>

          {/* Medicine Items */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <label className="field-label" style={{ margin: 0 }}>Danh sách thuốc <span style={{ color: 'var(--danger-500)' }}>*</span></label>
              <button type="button" className="btn btn-outline" onClick={addItem} style={{ fontSize: 13 }}>
                <Plus size={14} /> Thêm thuốc
              </button>
            </div>
            {errors.items && <p className="field-error" role="alert">{errors.items}</p>}
            <div style={{ display: 'grid', gap: 10 }}>
              {form.items.map((item, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '2fr 80px 1fr 1fr auto',
                  gap: 8, padding: 12, background: 'var(--ink-50)',
                  borderRadius: 'var(--radius-md)', alignItems: 'end',
                }}>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label className="field-label" style={{ fontSize: 12 }} htmlFor={`rx-med-${i}`}>ID Thuốc</label>
                    <input id={`rx-med-${i}`} className="input" placeholder="UUID thuốc"
                      value={item.medicineId} onChange={e => updateItem(i, 'medicineId', e.target.value)} />
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label className="field-label" style={{ fontSize: 12 }} htmlFor={`rx-qty-${i}`}>SL</label>
                    <input id={`rx-qty-${i}`} type="number" min={1} className="input"
                      value={item.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))} />
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label className="field-label" style={{ fontSize: 12 }} htmlFor={`rx-dosage-${i}`}>Liều dùng</label>
                    <input id={`rx-dosage-${i}`} className="input" placeholder="2 viên/lần"
                      value={item.dosage} onChange={e => updateItem(i, 'dosage', e.target.value)} />
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label className="field-label" style={{ fontSize: 12 }} htmlFor={`rx-instr-${i}`}>Hướng dẫn</label>
                    <input id={`rx-instr-${i}`} className="input" placeholder="Uống sau ăn"
                      value={item.instructions} onChange={e => updateItem(i, 'instructions', e.target.value)} />
                  </div>
                  <button type="button" className="btn btn-ghost btn-icon" style={{ color: 'var(--danger-500)', alignSelf: 'end' }}
                    onClick={() => removeItem(i)} disabled={form.items.length <= 1} aria-label="Xóa thuốc">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Hủy</button>
            <button type="button" className="btn btn-outline" disabled={saving}
              onClick={e => handleSubmit(e, 'draft')}>
              <FileText size={16} /> {saving ? 'Đang lưu...' : 'Lưu nháp'}
            </button>
            <button type="button" className="btn btn-primary" disabled={saving}
              onClick={e => handleSubmit(e, 'signed')}>
              <CheckCircle2 size={16} /> {saving ? 'Đang tạo...' : 'Tạo & Ký đơn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function PrescriptionDetailModal({ prescription, onClose, onAction }) {
  const [acting, setActing] = useState(null)

  async function handleSign() {
    setActing('sign')
    try {
      await signPrescription(prescription.id)
      toast.success('Đã ký đơn thuốc! Trạng thái: DRAFT → SIGNED')
      onAction()
    } catch (e) { toast.error(getApiErrorMessage(e)) }
    finally { setActing(null) }
  }

  async function handleCancel() {
    if (!window.confirm('Bạn có chắc muốn hủy đơn thuốc này?')) return
    setActing('cancel')
    try {
      await cancelPrescription(prescription.id)
      toast.success('Đã hủy đơn thuốc. Trạng thái: → CANCELLED')
      onAction()
    } catch (e) { toast.error(getApiErrorMessage(e)) }
    finally { setActing(null) }
  }

  async function handlePrint() {
    setActing('print')
    try {
      await printPrescription(prescription.id)
      toast.success('Đã gửi lệnh in đơn thuốc.')
    } catch (e) { toast.error(getApiErrorMessage(e)) }
    finally { setActing(null) }
  }

  const p = prescription
  function fmt(val) {
    if (!val) return '—'
    try { return new Date(val).toLocaleString('vi-VN') } catch { return val }
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="rx-detail-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,29,61,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title" id="rx-detail-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="mono">{p.code}</span>
              <PrescriptionStatusBadge status={p.status} />
            </h2>
            <p className="card-subtitle">Chi tiết đơn thuốc</p>
          </div>
          <button className="btn btn-ghost btn-icon" type="button" onClick={onClose} aria-label="Đóng"><X size={18} /></button>
        </div>

        <div className="card-body" style={{ display: 'grid', gap: 16 }}>
          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Mã đơn', <span className="mono">{p.code}</span>],
              ['Trạng thái', <PrescriptionStatusBadge status={p.status} />],
              ['ID Bệnh nhân', <span className="mono" style={{ fontSize: 12 }}>{p.patientId}</span>],
              ['ID Dược sĩ', <span className="mono" style={{ fontSize: 12 }}>{p.doctorId}</span>],
              ['Ngày ký', fmt(p.issuedAt)],
              ['Liên kết đơn hàng', p.orderId ? <span className="mono" style={{ fontSize: 12 }}>{p.orderId}</span> : <span style={{ color: 'var(--ink-400)' }}>Chưa liên kết</span>],
            ].map(([label, val], i) => (
              <div key={i}>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-500)', fontWeight: 600 }}>{label}</p>
                <p style={{ margin: '2px 0 0', fontSize: 14, color: 'var(--ink-900)' }}>{val}</p>
              </div>
            ))}
          </div>

          {p.diagnosis && (
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--ink-500)', fontWeight: 600 }}>Chẩn đoán</p>
              <p style={{ margin: 0, padding: '8px 12px', background: 'var(--ink-50)', borderRadius: 'var(--radius-md)', fontSize: 14 }}>{p.diagnosis}</p>
            </div>
          )}

          {/* Signature hash — điểm nhấn kỹ thuật */}
          {p.signatureHash && (
            <div style={{ padding: '10px 12px', background: 'var(--accent-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-100)' }}>
              <p style={{ margin: '0 0 4px', fontSize: 11, color: 'var(--accent-700)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🔐 Chữ ký số (Digital Signature Hash)
              </p>
              <p className="mono" style={{ margin: 0, fontSize: 12, color: 'var(--ink-700)', wordBreak: 'break-all' }}>{p.signatureHash}</p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--accent-600)' }}>UUID.nameUUIDFromBytes(code | patientId | doctorId | diagnosis)</p>
            </div>
          )}

          {/* Notes */}
          {p.notes && (
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--ink-500)', fontWeight: 600 }}>Ghi chú</p>
              <p style={{ margin: 0, fontSize: 14 }}>{p.notes}</p>
            </div>
          )}

          {/* State machine actions */}
          <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: '1px solid var(--ink-200)', flexWrap: 'wrap' }}>
            {p.status === 'DRAFT' && (
              <button className="btn btn-primary" type="button" disabled={!!acting} onClick={handleSign}>
                <CheckCircle2 size={16} /> {acting === 'sign' ? 'Đang ký...' : 'Ký đơn (DRAFT → SIGNED)'}
              </button>
            )}
            {(p.status === 'DRAFT' || (p.status === 'SIGNED' && !p.orderId)) && (
              <button className="btn btn-outline" type="button" disabled={!!acting}
                onClick={handleCancel} style={{ color: 'var(--danger-500)', borderColor: 'var(--danger-500)' }}>
                <XCircle size={16} /> {acting === 'cancel' ? 'Đang hủy...' : 'Hủy đơn (→ CANCELLED)'}
              </button>
            )}
            {p.status === 'SIGNED' && (
              <button className="btn btn-outline" type="button" disabled={!!acting} onClick={handlePrint}>
                <Printer size={16} /> {acting === 'print' ? 'Đang in...' : 'In đơn'}
              </button>
            )}
            {p.status === 'SIGNED' && p.orderId && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--warning-50)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--warning-700)' }}>
                <AlertTriangle size={14} /> Không thể hủy — đã liên kết với đơn hàng
              </div>
            )}
            <button className="btn btn-outline" type="button" onClick={onClose} style={{ marginLeft: 'auto' }}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function PrescriptionListPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [detailTarget, setDetailTarget] = useState(null)
  const [searchCode, setSearchCode] = useState('')

  const query = useQuery({
    queryKey: ['prescriptions', page],
    queryFn: () => listPrescriptions({ page, size: 20 }),
  })

  const prescriptions = useMemo(() => {
    const data = query.data
    if (!data) return []
    if (Array.isArray(data.content)) return data.content
    if (Array.isArray(data.data)) return data.data
    if (Array.isArray(data)) return data
    return []
  }, [query.data])

  const totalPages = query.data?.totalPages ?? 0

  function fmt(val) {
    if (!val) return '—'
    try { return new Date(val).toLocaleDateString('vi-VN') } catch { return val }
  }

  const statusCounts = useMemo(() => ({
    DRAFT: prescriptions.filter(p => p.status === 'DRAFT').length,
    SIGNED: prescriptions.filter(p => p.status === 'SIGNED').length,
    CANCELLED: prescriptions.filter(p => p.status === 'CANCELLED').length,
  }), [prescriptions])

  const filtered = useMemo(() => {
    if (!searchCode.trim()) return prescriptions
    return prescriptions.filter(p =>
      p.code?.toLowerCase().includes(searchCode.toLowerCase()),
    )
  }, [prescriptions, searchCode])

  return (
    <DashboardLayout>
      <div className="page-stack">
        {/* Header */}
        <header className="page-header">
          <div>
            <p className="page-kicker">Đơn thuốc</p>
            <h1 className="page-title">Prescriptions</h1>
            <p className="page-description">
              Quản lý đơn thuốc. Mã đơn tự sinh dạng <strong className="mono">RX-2026xxxx</strong>. 
              State machine: <strong>DRAFT → SIGNED → CANCELLED</strong>.
            </p>
          </div>
          <button id="new-prescription-btn" className="btn btn-primary" type="button" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Tạo đơn thuốc
          </button>
        </header>

        {/* Stats */}
        <section className="inventory-stat-grid" aria-label="Thống kê đơn thuốc">
          <div className="stat-card">
            <div><p className="stat-title">Đang nháp</p><p className="stat-value mono">{statusCounts.DRAFT}</p></div>
            <FileText color="var(--ink-500)" size={24} />
          </div>
          <div className="stat-card">
            <div><p className="stat-title">Đã ký</p><p className="stat-value mono">{statusCounts.SIGNED}</p></div>
            <CheckCircle2 color="var(--accent-600)" size={24} />
          </div>
          <div className="stat-card">
            <div><p className="stat-title">Đã hủy</p><p className="stat-value mono">{statusCounts.CANCELLED}</p></div>
            <XCircle color="var(--danger-500)" size={24} />
          </div>
        </section>

        {/* Toolbar */}
        <div className="card card-body" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="field-label" htmlFor="rx-search">Tìm kiếm mã đơn</label>
            <input id="rx-search" className="input" placeholder="RX-2026..." value={searchCode}
              onChange={e => setSearchCode(e.target.value)} />
          </div>
          <button className="btn btn-ghost btn-icon" type="button" onClick={() => query.refetch()} title="Tải lại" style={{ alignSelf: 'end' }}>
            <RefreshCcw size={16} />
          </button>
        </div>

        {/* Table */}
        <section className="card" aria-labelledby="rx-table-title">
          <div className="card-header">
            <h2 className="card-title" id="rx-table-title">
              Danh sách đơn thuốc
              {!query.isLoading && (
                <span style={{ marginLeft: 8, fontWeight: 400, color: 'var(--ink-500)', fontSize: 14 }}>
                  ({filtered.length} đơn)
                </span>
              )}
            </h2>
          </div>

          {query.isLoading ? (
            <div className="empty-state">Đang tải đơn thuốc...</div>
          ) : query.isError ? (
            <div className="error-state" role="alert">{getApiErrorMessage(query.error)}</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              {searchCode ? `Không tìm thấy đơn nào với mã "${searchCode}".` : 'Chưa có đơn thuốc nào.'}
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Bệnh nhân ID</th>
                    <th>Dược sĩ ID</th>
                    <th>Chẩn đoán</th>
                    <th>Trạng thái</th>
                    <th>Ngày ký</th>
                    <th>Liên kết ĐH</th>
                    <th aria-label="Thao tác" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id}>
                      <td>
                        <strong className="mono" style={{ color: 'var(--accent-700)' }}>{p.code}</strong>
                      </td>
                      <td className="mono" style={{ fontSize: 12 }}>{p.patientId?.slice(0, 8)}…</td>
                      <td className="mono" style={{ fontSize: 12 }}>{p.doctorId?.slice(0, 8)}…</td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.diagnosis || '—'}</td>
                      <td><PrescriptionStatusBadge status={p.status} /></td>
                      <td className="mono">{fmt(p.issuedAt)}</td>
                      <td>
                        {p.orderId
                          ? <span className="badge badge-info" style={{ fontSize: 11 }}>Đã liên kết</span>
                          : <span style={{ color: 'var(--ink-300)', fontSize: 13 }}>—</span>
                        }
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-outline btn-icon"
                            type="button"
                            title="Xem chi tiết & thao tác"
                            onClick={() => setDetailTarget(p)}
                            aria-label={`Xem chi tiết ${p.code}`}
                          >
                            <Eye size={16} />
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
              <span style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: 'var(--ink-500)' }}>Trang {page + 1} / {totalPages}</span>
              <button className="btn btn-outline" type="button" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Tiếp →</button>
            </div>
          )}
        </section>
      </div>

      {/* Modals */}
      {showForm && (
        <PrescriptionFormModal
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); queryClient.invalidateQueries({ queryKey: ['prescriptions'] }) }}
        />
      )}
      {detailTarget && (
        <PrescriptionDetailModal
          prescription={detailTarget}
          onClose={() => setDetailTarget(null)}
          onAction={() => { queryClient.invalidateQueries({ queryKey: ['prescriptions'] }); setDetailTarget(null) }}
        />
      )}
    </DashboardLayout>
  )
}
