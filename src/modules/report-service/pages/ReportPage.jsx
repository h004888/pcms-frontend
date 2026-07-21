import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  BarChart2,
  Download,
  RefreshCcw,
  Calendar,
  TrendingUp,
  Package,
  Users,
  Clock,
  CheckCircle2,
  Trash2,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import {
  getRevenueReport,
  getInventoryReport,
  getStaffReport,
  exportReport,
  createReportSchedule,
  listReportSchedules,
  cancelReportSchedule,
} from '../api/reportApi.js'
import { listUsers } from '../../user-service/api/userApi.js'

const TAB_REVENUE = 'revenue'
const TAB_INVENTORY = 'inventory'
const TAB_STAFF = 'staff'
const TAB_SCHEDULE = 'schedule'

function today() {
  return new Date().toISOString().slice(0, 10)
}
function monthStart() {
  const d = new Date()
  d.setDate(1)
  return d.toISOString().slice(0, 10)
}

function formatCurrency(val) {
  if (val == null) return '—'
  return Number(val).toLocaleString('vi-VN') + ' ₫'
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div>
        <p className="stat-title">{label}</p>
        <p className="stat-value mono">{value}</p>
      </div>
      <Icon size={24} color={color || 'var(--accent-600)'} aria-hidden="true" />
    </div>
  )
}

// ─── Revenue Tab ─────────────────────────────────────────────────────────────
function RevenueTab() {
  const [from, setFrom] = useState(monthStart())
  const [to, setTo] = useState(today())
  const [groupBy, setGroupBy] = useState('day')

  const query = useQuery({
    queryKey: ['report-revenue', from, to, groupBy],
    queryFn: () => getRevenueReport({ from, to, groupBy }),
    enabled: !!from && !!to,
  })

  const rows = query.data?.data || []
  const meta = query.data?.total || {}

  const totalNet = useMemo(
    () => rows.reduce((acc, r) => acc + (Number(r.net) || 0), 0),
    [rows],
  )
  const totalOrders = useMemo(
    () => rows.reduce((acc, r) => acc + (Number(r.orders) || 0), 0),
    [rows],
  )

  async function handleExport(format) {
    try {
      const res = await exportReport({ type: 'revenue', format, from, to })
      const ext = format === 'pdf' ? 'pdf' : 'xlsx'
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `revenue-report.${ext}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Đã tải file báo cáo doanh thu (.${ext})`)
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  return (
    <div className="page-stack">
      {/* Toolbar */}
      <div className="card card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px auto auto', gap: 12, alignItems: 'end' }}>
        <div className="field">
          <label className="field-label" htmlFor="rev-from">Từ ngày</label>
          <input id="rev-from" type="date" className="input" value={from} max={to} onChange={e => setFrom(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="rev-to">Đến ngày</label>
          <input id="rev-to" type="date" className="input" value={to} min={from} onChange={e => setTo(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="rev-group">Nhóm theo</label>
          <select id="rev-group" className="select" value={groupBy} onChange={e => setGroupBy(e.target.value)}>
            <option value="day">Ngày</option>
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
          </select>
        </div>
        <button className="btn btn-outline" style={{ alignSelf: 'end' }} type="button" onClick={() => handleExport('excel')}>
          <Download size={16} aria-hidden="true" /> Excel
        </button>
        <button className="btn btn-outline" style={{ alignSelf: 'end' }} type="button" onClick={() => handleExport('pdf')}>
          <Download size={16} aria-hidden="true" /> PDF
        </button>
      </div>

      {/* Summary stats */}
      <section className="inventory-stat-grid" aria-label="Tổng quan doanh thu">
        <StatCard icon={TrendingUp} label="Doanh thu thuần" value={formatCurrency(totalNet)} />
        <StatCard icon={BarChart2} label="Tổng đơn hàng" value={totalOrders.toLocaleString('vi-VN')} color="var(--ink-600)" />
      </section>

      {/* Table */}
      <section className="card" aria-labelledby="revenue-table-title">
        <div className="card-header">
          <div>
            <h2 className="card-title" id="revenue-table-title">Chi tiết doanh thu</h2>
            <p className="card-subtitle">Nhóm theo: {groupBy === 'day' ? 'Ngày' : groupBy === 'week' ? 'Tuần' : 'Tháng'}</p>
          </div>
          <button className="btn btn-ghost btn-icon" type="button" onClick={() => query.refetch()} title="Tải lại">
            <RefreshCcw size={16} aria-hidden="true" />
          </button>
        </div>

        {query.isLoading ? (
          <div className="empty-state">Đang tải dữ liệu doanh thu...</div>
        ) : query.isError ? (
          <div className="error-state" role="alert">{getApiErrorMessage(query.error)}</div>
        ) : rows.length === 0 ? (
          <div className="empty-state">Không có dữ liệu trong khoảng thời gian đã chọn.</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Kỳ</th>
                  <th style={{ textAlign: 'right' }}>Đơn hàng</th>
                  <th style={{ textAlign: 'right' }}>Doanh thu gộp</th>
                  <th style={{ textAlign: 'right' }}>Giảm giá</th>
                  <th style={{ textAlign: 'right' }}>Doanh thu thuần</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.date || i}>
                    <td className="mono">{row.date}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{Number(row.orders || 0).toLocaleString('vi-VN')}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{formatCurrency(row.gross)}</td>
                    <td className="mono" style={{ textAlign: 'right', color: 'var(--danger-500)' }}>
                      {row.discount ? `-${formatCurrency(row.discount)}` : '—'}
                    </td>
                    <td className="mono" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-700)' }}>
                      {formatCurrency(row.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid var(--ink-200)', fontWeight: 700 }}>
                  <td>Tổng cộng</td>
                  <td className="mono" style={{ textAlign: 'right' }}>{totalOrders.toLocaleString('vi-VN')}</td>
                  <td></td>
                  <td></td>
                  <td className="mono" style={{ textAlign: 'right', color: 'var(--accent-700)' }}>{formatCurrency(totalNet)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

// ─── Inventory Tab ────────────────────────────────────────────────────────────
function InventoryTab() {
  const query = useQuery({
    queryKey: ['report-inventory'],
    queryFn: () => getInventoryReport(),
  })

  async function handleExport(format) {
    try {
      const from = monthStart()
      const to = today()
      const res = await exportReport({ type: 'inventory', format, from, to })
      const ext = format === 'pdf' ? 'pdf' : 'xlsx'
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `inventory-report.${ext}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Đã tải file báo cáo kho (.${ext})`)
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  const sections = query.data?.data || []
  const meta = query.data?.total || {}
  const lowStockItems = sections.find(s => s.section === 'lowStock')?.items || []
  const stockDetails = sections.find(s => s.section === 'stockDetails')?.items || []

  return (
    <div className="page-stack">
      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn btn-outline" type="button" onClick={() => handleExport('excel')}>
          <Download size={16} aria-hidden="true" /> Xuất Excel
        </button>
        <button className="btn btn-outline" type="button" onClick={() => handleExport('pdf')}>
          <Download size={16} aria-hidden="true" /> Xuất PDF
        </button>
        <button className="btn btn-ghost btn-icon" type="button" onClick={() => query.refetch()} title="Tải lại">
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* Summary */}
      <section className="inventory-stat-grid" aria-label="Tổng quan kho">
        <StatCard icon={Package} label="Tổng lô hàng" value={meta.totalBatches ?? '—'} color="var(--ink-600)" />
        <StatCard icon={Package} label="Lô dưới mức tối thiểu" value={meta.lowStockCount ?? '—'} color="var(--warning-700)" />
      </section>

      {query.isLoading ? (
        <div className="empty-state">Đang tải báo cáo kho...</div>
      ) : query.isError ? (
        <div className="error-state" role="alert">{getApiErrorMessage(query.error)}</div>
      ) : (
        <>
          {/* Low stock */}
          <section className="card" aria-labelledby="low-stock-title">
            <div className="card-header">
              <div>
                <h2 className="card-title" id="low-stock-title">Dưới mức tối thiểu ({lowStockItems.length})</h2>
                <p className="card-subtitle">Các mặt hàng cần nhập thêm.</p>
              </div>
            </div>
            {lowStockItems.length === 0 ? (
              <div className="empty-state">Không có mặt hàng nào dưới mức tối thiểu 🎉</div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Thuốc</th>
                      <th>Chi nhánh</th>
                      <th style={{ textAlign: 'right' }}>Tồn</th>
                      <th style={{ textAlign: 'right' }}>Tối thiểu</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockItems.map((item, i) => (
                      <tr key={i}>
                        <td>{String(item.medicineId || '').slice(0, 8)}…</td>
                        <td>{String(item.branchId || '').slice(0, 8)}…</td>
                        <td className="mono" style={{ textAlign: 'right', color: 'var(--danger-500)', fontWeight: 700 }}>{item.qtyOnHand ?? '—'}</td>
                        <td className="mono" style={{ textAlign: 'right' }}>{item.minStockLevel ?? '—'}</td>
                        <td>
                          <span className="badge badge-danger">{item.status || 'LOW'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Stock details summary */}
          <section className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Chi tiết tồn kho ({stockDetails.length} lô)</h2>
              </div>
            </div>
            {stockDetails.length === 0 ? (
              <div className="empty-state">Không có dữ liệu tồn kho.</div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Thuốc</th>
                      <th>Chi nhánh</th>
                      <th style={{ textAlign: 'right' }}>Tồn</th>
                      <th style={{ textAlign: 'right' }}>Tối thiểu</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockDetails.slice(0, 50).map((item, i) => (
                      <tr key={i}>
                        <td className="mono">{String(item.medicineId || '').slice(0, 8)}…</td>
                        <td className="mono">{String(item.branchId || '').slice(0, 8)}…</td>
                        <td className="mono" style={{ textAlign: 'right' }}>{item.qtyOnHand ?? '—'}</td>
                        <td className="mono" style={{ textAlign: 'right' }}>{item.minStockLevel ?? '—'}</td>
                        <td>
                          <span className={`badge ${(item.qtyOnHand ?? 0) < (item.minStockLevel ?? 0) ? 'badge-danger' : 'badge-success'}`}>
                            {item.status || ((item.qtyOnHand ?? 0) < (item.minStockLevel ?? 0) ? 'LOW' : 'OK')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

// ─── Staff Tab ────────────────────────────────────────────────────────────────
function StaffTab() {
  const [from, setFrom] = useState(monthStart())
  const [to, setTo] = useState(today())

  const query = useQuery({
    queryKey: ['report-staff', from, to],
    queryFn: () => getStaffReport({ fromDate: from, toDate: to }),
    enabled: !!from && !!to,
  })

  const usersQuery = useQuery({
    queryKey: ['users-list-for-report'],
    queryFn: () => listUsers({ size: 1000 }),
  })

  const rows = query.data?.data || []
  const userMap = useMemo(() => {
    const map = {}
    if (usersQuery.data?.data) {
      usersQuery.data.data.forEach(u => {
        map[u.id] = u.fullName || u.username
      })
    }
    return map
  }, [usersQuery.data])

  async function handleExport(format) {
    try {
      const res = await exportReport({ type: 'staff', format, from, to })
      const ext = format === 'pdf' ? 'pdf' : 'xlsx'
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `staff-report.${ext}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Đã tải file báo cáo nhân sự (.${ext})`)
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  return (
    <div className="page-stack">
      <div className="card card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 12, alignItems: 'end' }}>
        <div className="field">
          <label className="field-label" htmlFor="staff-from">Từ ngày</label>
          <input id="staff-from" type="date" className="input" value={from} max={to} onChange={e => setFrom(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="staff-to">Đến ngày</label>
          <input id="staff-to" type="date" className="input" value={to} min={from} onChange={e => setTo(e.target.value)} />
        </div>
        <button className="btn btn-outline" style={{ alignSelf: 'end' }} type="button" onClick={() => handleExport('excel')}>
          <Download size={16} /> Excel
        </button>
        <button className="btn btn-outline" style={{ alignSelf: 'end' }} type="button" onClick={() => handleExport('pdf')}>
          <Download size={16} /> PDF
        </button>
      </div>

      <section className="card" aria-labelledby="staff-table-title">
        <div className="card-header">
          <div>
            <h2 className="card-title" id="staff-table-title">Hiệu suất nhân viên</h2>
            <p className="card-subtitle">Thống kê số đơn và doanh thu theo nhân viên.</p>
          </div>
          <button className="btn btn-ghost btn-icon" type="button" onClick={() => query.refetch()} title="Tải lại">
            <RefreshCcw size={16} />
          </button>
        </div>

        {query.isLoading ? (
          <div className="empty-state">Đang tải dữ liệu nhân sự...</div>
        ) : query.isError ? (
          <div className="error-state" role="alert">{getApiErrorMessage(query.error)}</div>
        ) : rows.length === 0 ? (
          <div className="empty-state">Không có dữ liệu trong khoảng thời gian đã chọn.</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nhân viên</th>
                  <th style={{ textAlign: 'right' }}>Số đơn</th>
                  <th style={{ textAlign: 'right' }}>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.staffId || i}>
                    <td className="mono">{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{userMap[row.staffId] || 'Không xác định'}</div>
                      <div className="mono text-muted" style={{ fontSize: 12 }}>{row.staffId}</div>
                    </td>
                    <td className="mono" style={{ textAlign: 'right' }}>{Number(row.orders || 0).toLocaleString('vi-VN')}</td>
                    <td className="mono" style={{ textAlign: 'right', color: 'var(--accent-700)', fontWeight: 600 }}>
                      {formatCurrency(row.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

// ─── Schedule Tab ─────────────────────────────────────────────────────────────
function ScheduleTab() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    type: 'revenue',
    format: 'excel',
    cronExpression: '0 8 * * 1',
    recipientEmail: '',
  })

  const schedulesQuery = useQuery({
    queryKey: ['report-schedules'],
    queryFn: listReportSchedules,
  })

  const createMutation = useMutation({
    mutationFn: (payload) => createReportSchedule(payload),
    onSuccess: () => {
      toast.success('Đã tạo lịch báo cáo thành công!')
      queryClient.invalidateQueries({ queryKey: ['report-schedules'] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const cancelMutation = useMutation({
    mutationFn: (id) => cancelReportSchedule(id),
    onSuccess: () => {
      toast.success('Đã hủy lịch báo cáo.')
      queryClient.invalidateQueries({ queryKey: ['report-schedules'] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('pcms_user') || '{}') } catch { return {} }
  })()

  function handleSubmit(e) {
    e.preventDefault()
    createMutation.mutate({
      ...form,
      createdBy: user.id || undefined,
    })
  }

  const schedules = Array.isArray(schedulesQuery.data) ? schedulesQuery.data : []

  return (
    <div className="page-stack">
      {/* Create form */}
      <section className="card" aria-labelledby="schedule-form-title">
        <div className="card-header">
          <h2 className="card-title" id="schedule-form-title">Tạo lịch báo cáo tự động</h2>
        </div>
        <form className="card-body" onSubmit={handleSubmit}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
          <div className="field">
            <label className="field-label" htmlFor="sch-type">Loại báo cáo</label>
            <select id="sch-type" className="select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="revenue">Doanh thu</option>
              <option value="inventory">Kho</option>
              <option value="staff">Nhân sự</option>
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="sch-format">Định dạng</label>
            <select id="sch-format" className="select" value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))}>
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="sch-cron">Cron Expression</label>
            <input id="sch-cron" className="input" placeholder="0 8 * * 1" value={form.cronExpression}
              onChange={e => setForm(f => ({ ...f, cronExpression: e.target.value }))} />
            <p className="field-hint">Ví dụ: <code>0 8 * * 1</code> = 8h sáng thứ Hai</p>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="sch-email">Email nhận báo cáo</label>
            <input id="sch-email" type="email" className="input" placeholder="manager@pcms.vn" value={form.recipientEmail}
              onChange={e => setForm(f => ({ ...f, recipientEmail: e.target.value }))} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" type="submit" disabled={createMutation.isPending}>
              <Plus size={16} aria-hidden="true" />
              {createMutation.isPending ? 'Đang tạo...' : 'Tạo lịch'}
            </button>
          </div>
        </form>
      </section>

      {/* Schedules list */}
      <section className="card" aria-labelledby="schedule-list-title">
        <div className="card-header">
          <h2 className="card-title" id="schedule-list-title">Danh sách lịch hiện có</h2>
          <button className="btn btn-ghost btn-icon" type="button" onClick={() => schedulesQuery.refetch()} title="Tải lại">
            <RefreshCcw size={16} />
          </button>
        </div>

        {schedulesQuery.isLoading ? (
          <div className="empty-state">Đang tải...</div>
        ) : schedules.length === 0 ? (
          <div className="empty-state">Chưa có lịch báo cáo nào được tạo.</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Loại</th>
                  <th>Định dạng</th>
                  <th>Cron</th>
                  <th>Email nhận</th>
                  <th>Trạng thái lịch</th>
                  <th>Lần chạy cuối</th>
                  <th>Kết quả</th>
                  <th aria-label="Thao tác" />
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s.id}>
                    <td><span className="badge badge-info">{s.type}</span></td>
                    <td className="mono">{s.format}</td>
                    <td className="mono">{s.cronExpression}</td>
                    <td>{s.recipientEmail || '—'}</td>
                    <td>
                      <span className={`badge ${s.active !== false ? 'badge-success' : 'badge-muted'}`}>
                        {s.active !== false ? 'Đang chạy' : 'Đã hủy'}
                      </span>
                    </td>
                    <td className="mono" style={{ fontSize: 13 }}>
                      {s.lastRunAt ? new Date(s.lastRunAt).toLocaleString('vi-VN') : 'Chưa chạy'}
                    </td>
                    <td>
                      {s.lastStatus && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span className={`badge ${s.lastStatus === 'SUCCESS' ? 'badge-success' : s.lastStatus === 'FAILED' ? 'badge-danger' : 'badge-info'}`} style={{ width: 'fit-content' }}>
                            {s.lastStatus}
                          </span>
                          {s.lastMessage && <span className="text-muted" style={{ fontSize: 12, maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={s.lastMessage}>{s.lastMessage}</span>}
                        </div>
                      )}
                    </td>
                    <td>
                      {s.active !== false && (
                        <button
                          className="btn btn-ghost btn-icon"
                          title="Hủy lịch"
                          type="button"
                          disabled={cancelMutation.isPending}
                          onClick={() => cancelMutation.mutate(s.id)}
                          style={{ color: 'var(--danger-500)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function ReportPage() {
  const [tab, setTab] = useState(TAB_REVENUE)

  const tabs = [
    { id: TAB_REVENUE, label: 'Doanh thu', icon: TrendingUp },
    { id: TAB_INVENTORY, label: 'Kho hàng', icon: Package },
    { id: TAB_STAFF, label: 'Nhân sự', icon: Users },
    { id: TAB_SCHEDULE, label: 'Lập lịch', icon: Clock },
  ]

  return (
    <DashboardLayout>
      <div className="page-stack">
        {/* Header */}
        <header className="page-header">
          <div>
            <p className="page-kicker">Báo cáo</p>
            <h1 className="page-title">Báo cáo</h1>
            <p className="page-description">
              Xem và xuất báo cáo doanh thu, tồn kho, nhân sự. Hỗ trợ export Excel & PDF và lập lịch tự động.
            </p>
          </div>
          <BarChart2 size={40} color="var(--accent-600)" aria-hidden="true" />
        </header>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Loại báo cáo"
          style={{
            display: 'flex',
            gap: 4,
            borderBottom: '2px solid var(--ink-200)',
            paddingBottom: 0,
          }}
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              id={`tab-${id}`}
              aria-controls={`panel-${id}`}
              type="button"
              onClick={() => setTab(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: 'none',
                border: 'none',
                borderBottom: tab === id ? '2px solid var(--accent-600)' : '2px solid transparent',
                marginBottom: -2,
                color: tab === id ? 'var(--accent-700)' : 'var(--ink-500)',
                fontWeight: tab === id ? 700 : 500,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === TAB_REVENUE && <RevenueTab />}
          {tab === TAB_INVENTORY && <InventoryTab />}
          {tab === TAB_STAFF && <StaffTab />}
          {tab === TAB_SCHEDULE && <ScheduleTab />}
        </div>
      </div>
    </DashboardLayout>
  )
}
