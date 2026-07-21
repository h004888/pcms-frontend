import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Download } from 'lucide-react'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import {
  exportReport,
  getRealtimeStats,
  getRevenue,
  getStaffReport,
  getTopMedicines,
  listBranches,
} from '../api/reportApi.js'

const TABS = [
  { key: 'dashboard', label: 'Tổng quan' },
  { key: 'sales', label: 'Báo cáo doanh thu' },
  { key: 'revenue', label: 'Phân tích doanh thu' },
  { key: 'staff', label: 'Hiệu suất nhân viên' },
]

const BAR_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

function today() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function startOfYear() {
  return `${new Date().getFullYear()}-01-01`
}

function formatVND(amount) {
  if (amount == null) return '--'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', notation: 'compact' }).format(amount)
}

function formatVNDFull(amount) {
  if (amount == null) return '--'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

// ── Shared date range bar ──────────────────────────────────────────
function DateRangeBar({ from, to, onFromChange, onToChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--ink-600)' }}>
        Từ ngày
        <input
          type="date"
          value={from}
          max={to}
          onChange={(e) => onFromChange(e.target.value)}
          style={{
            padding: '5px 10px',
            border: '1px solid var(--ink-200)',
            borderRadius: 6,
            fontSize: 14,
            background: 'white',
          }}
        />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--ink-600)' }}>
        Đến ngày
        <input
          type="date"
          value={to}
          min={from}
          onChange={(e) => onToChange(e.target.value)}
          style={{
            padding: '5px 10px',
            border: '1px solid var(--ink-200)',
            borderRadius: 6,
            fontSize: 14,
            background: 'white',
          }}
        />
      </label>
    </div>
  )
}

// ── Dashboard Tab ──────────────────────────────────────────────────
function DashboardTab() {
  const statsQuery = useQuery({
    queryKey: ['realtime-stats'],
    queryFn: () => getRealtimeStats(),
    refetchInterval: 60_000,
  })

  const stats = statsQuery.data?.data || statsQuery.data || {}

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Tổng quan thời gian thực</h2>
      {statsQuery.isLoading ? (
        <p style={{ color: 'var(--ink-400)' }}>Đang tải...</p>
      ) : statsQuery.isError ? (
        <p style={{ color: 'var(--color-error)' }}>{getApiErrorMessage(statsQuery.error)}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { label: 'Doanh thu hôm nay', value: formatVNDFull(stats.todayRevenue), color: 'var(--color-primary)' },
            { label: 'Đơn hàng hôm nay', value: stats.todayOrders ?? '--', color: '#10b981' },
            { label: 'Hàng sắp hết', value: stats.lowStockCount ?? '--', color: '#ef4444' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: 20, border: '1px solid var(--ink-200)', borderRadius: 10, background: 'white' }}>
              <p style={{ fontSize: 12, color: 'var(--ink-400)', marginBottom: 8 }}>{label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color }}>{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Sales Report Tab ───────────────────────────────────────────────
function SalesReportTab() {
  const [from, setFrom] = useState(startOfYear)
  const [to, setTo] = useState(today)

  const revenueQuery = useQuery({
    queryKey: ['revenue-all', from, to],
    queryFn: () => getRevenue({ groupBy: 'month', from, to }),
    enabled: Boolean(from && to),
  })

  const rows = useMemo(
    () => revenueQuery.data?.data || revenueQuery.data?.content || [],
    [revenueQuery.data],
  )

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Báo cáo doanh thu theo tháng (tất cả chi nhánh)</h2>
      <DateRangeBar from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
      {revenueQuery.isLoading ? (
        <p style={{ color: 'var(--ink-400)' }}>Đang tải...</p>
      ) : revenueQuery.isError ? (
        <p style={{ color: 'var(--color-error)' }}>{getApiErrorMessage(revenueQuery.error)}</p>
      ) : rows.length === 0 ? (
        <p style={{ color: 'var(--ink-400)' }}>Không có dữ liệu trong khoảng thời gian này.</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={rows} margin={{ left: 16, right: 16, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--ink-100)" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => formatVND(v)} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => formatVNDFull(v)} />
            <Line type="monotone" dataKey="net" name="Doanh thu thuần" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="gross" name="Doanh thu gộp" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ── Revenue Analytics Tab ──────────────────────────────────────────
function RevenueAnalyticsTab() {
  const [from, setFrom] = useState(startOfYear)
  const [to, setTo] = useState(today)

  const branchesQuery = useQuery({
    queryKey: ['branches-list'],
    queryFn: listBranches,
  })

  const branches = useMemo(
    () => branchesQuery.data?.data || branchesQuery.data?.content || [],
    [branchesQuery.data],
  )

  const revenueQuery = useQuery({
    queryKey: ['branch-revenues', branches.map((b) => b.id), from, to],
    queryFn: async () => {
      if (branches.length === 0) return []
      const results = await Promise.all(
        branches.map((b) =>
          getRevenue({ branchId: b.id, groupBy: 'month', from, to }).catch(() => null),
        ),
      )
      return branches.map((b, i) => {
        const rows = results[i]?.data || results[i]?.content || []
        const total = rows.reduce((s, r) => s + (r.net ?? r.gross ?? 0), 0)
        return { name: b.code || b.name, revenue: total }
      })
    },
    enabled: branches.length > 0 && Boolean(from && to),
  })

  const topQuery = useQuery({
    queryKey: ['top-medicines'],
    queryFn: () => getTopMedicines({ periodDays: 30, limit: 1 }),
  })

  const topMed = useMemo(() => {
    const d = topQuery.data?.data || topQuery.data
    if (Array.isArray(d)) return d[0]?.medicineName || d[0]?.name || '--'
    if (d?.medicineName || d?.name) return d.medicineName || d.name
    return '--'
  }, [topQuery.data])

  const chartData = revenueQuery.data || []
  const isLoading = branchesQuery.isLoading || revenueQuery.isLoading

  async function handleExport() {
    try {
      const response = await exportReport({ type: 'revenue', format: 'excel', from, to })
      const url = window.URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = 'revenue-report.xlsx'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      // Backend may not support export yet
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Doanh thu theo chi nhánh</h2>
        <button type="button" className="btn btn-outline" onClick={handleExport}>
          <Download size={15} aria-hidden="true" />
          Xuất PDF / Excel
        </button>
      </div>

      <DateRangeBar from={from} to={to} onFromChange={setFrom} onToChange={setTo} />

      {isLoading ? (
        <p style={{ color: 'var(--ink-400)' }}>Đang tải dữ liệu chi nhánh...</p>
      ) : revenueQuery.isError || branchesQuery.isError ? (
        <p style={{ color: 'var(--color-error)' }}>Lỗi tải dữ liệu.</p>
      ) : chartData.length === 0 ? (
        <p style={{ color: 'var(--ink-400)' }}>Không có dữ liệu doanh thu.</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ left: 16, right: 16, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--ink-100)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => formatVND(v)} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => formatVNDFull(v)} />
            <Bar dataKey="revenue" name="Doanh thu (VND)" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Bottom stats row */}
      <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, padding: '14px 20px', border: '1px solid var(--ink-200)', borderRadius: 10, background: 'white' }}>
          <p style={{ fontSize: 12, color: 'var(--ink-400)', marginBottom: 6 }}>Thuốc bán chạy nhất (30 ngày)</p>
          <p style={{ fontWeight: 600, fontSize: 15 }}>{topQuery.isLoading ? '...' : topMed}</p>
        </div>
        <div style={{ flex: 1, minWidth: 200, padding: '14px 20px', border: '1px solid var(--ink-200)', borderRadius: 10, background: 'white' }}>
          <p style={{ fontSize: 12, color: 'var(--ink-400)', marginBottom: 6 }}>Tỷ lệ đổi điểm thành viên</p>
          <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink-400)' }}>Chưa có dữ liệu</p>
        </div>
      </div>
    </div>
  )
}

// ── Staff Performance Tab ──────────────────────────────────────────
function StaffPerformanceTab() {
  const [from, setFrom] = useState(startOfYear)
  const [to, setTo] = useState(today)

  const staffQuery = useQuery({
    queryKey: ['staff-report', from, to],
    queryFn: () => getStaffReport({ fromDate: from, toDate: to }),
    enabled: Boolean(from && to),
  })

  const rows = useMemo(
    () => staffQuery.data?.data || staffQuery.data?.content || [],
    [staffQuery.data],
  )

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Hiệu suất nhân viên</h2>
      <DateRangeBar from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
      {staffQuery.isLoading ? (
        <p style={{ color: 'var(--ink-400)' }}>Đang tải...</p>
      ) : staffQuery.isError ? (
        <p style={{ color: 'var(--color-error)' }}>{getApiErrorMessage(staffQuery.error)}</p>
      ) : rows.length === 0 ? (
        <p style={{ color: 'var(--ink-400)' }}>Không có dữ liệu.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--ink-200)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--ink-500)', fontWeight: 600 }}>Nhân viên</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--ink-500)', fontWeight: 600 }}>Số đơn</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--ink-500)', fontWeight: 600 }}>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.staffId || i} style={{ borderBottom: '1px solid var(--ink-100)' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{row.staffId || '--'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>{row.orders ?? row.orderCount ?? '--'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace' }}>{formatVNDFull(row.revenue ?? row.totalRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────
export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('revenue')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid var(--ink-200)',
        padding: '0 32px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-primary)', letterSpacing: '-0.5px' }}>PCMS</span>
        <span style={{ color: 'var(--ink-300)' }}>|</span>
        <span style={{ fontWeight: 600, fontSize: 16, color: 'var(--ink-700)' }}>Phân tích & Báo cáo</span>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Left sub-nav */}
        <aside style={{
          width: 220,
          background: 'white',
          borderRight: '1px solid var(--ink-200)',
          padding: '24px 0',
          flexShrink: 0,
        }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: activeTab === tab.key ? 600 : 400,
                color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--ink-600)',
                background: activeTab === tab.key ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : 'transparent',
                border: 'none',
                borderRight: activeTab === tab.key ? '3px solid var(--color-primary)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: 32, overflowY: 'auto', minWidth: 0 }}>
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'sales' && <SalesReportTab />}
          {activeTab === 'revenue' && <RevenueAnalyticsTab />}
          {activeTab === 'staff' && <StaffPerformanceTab />}
        </main>
      </div>
    </div>
  )
}
