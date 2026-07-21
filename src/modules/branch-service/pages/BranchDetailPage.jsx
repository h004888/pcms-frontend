import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import {
  assignBranchManager,
  getBranch,
  getBranchImageUrl,
  getBranchStaff,
  getUser,
  listBranchManagers,
} from '../api/branchApi.js'
import { AssignManagerDialog } from '../components/AssignManagerDialog.jsx'
import { formatDateTime, getManagerName } from '../services/branchFormatters.js'
import { getBranchRevenue } from '../../report-service/api/reportApi.js'

function toIsoDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getCurrentMonthRange() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const lastDay = new Date(year, month + 1, 0).getDate()

  return {
    from: toIsoDate(new Date(year, month, 1)),
    to: toIsoDate(new Date(year, month, lastDay)),
    year,
    month,
    lastDay,
  }
}

function formatCurrency(value) {
  return `${new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(value)} VNĐ`
}

function formatChartAxis(value) {
  if (value === 0) return '0'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M VNĐ`
  if (value >= 1_000) return `${Math.round(value / 1_000)}K VNĐ`
  return `${Math.round(value)} VNĐ`
}

function roundChartMaximum(value) {
  if (value <= 0) return 1

  const magnitude = 10 ** Math.floor(Math.log10(value))
  return Math.ceil(value / magnitude) * magnitude
}

export function BranchDetailPage() {
  const { branchId } = useParams()
  const queryClient = useQueryClient()
  const [managerDialogOpen, setManagerDialogOpen] = useState(false)

  const branchQuery = useQuery({
    queryKey: ['branches', branchId],
    queryFn: () => getBranch(branchId),
  })
  const staffQuery = useQuery({
    queryKey: ['branches', branchId, 'staff'],
    queryFn: () => getBranchStaff(branchId),
    enabled: Boolean(branchId),
  })
  const managersQuery = useQuery({
    queryKey: ['branch-managers'],
    queryFn: () => listBranchManagers({ page: 0, size: 100 }),
  })
  const managerQuery = useQuery({
    queryKey: ['users', branchQuery.data?.managerId],
    queryFn: () => getUser(branchQuery.data.managerId),
    enabled: Boolean(branchQuery.data?.managerId),
  })
  const revenuePeriod = useMemo(() => getCurrentMonthRange(), [])
  const revenueQuery = useQuery({
    queryKey: ['branch-revenue', branchId, revenuePeriod.from, revenuePeriod.to],
    queryFn: () => getBranchRevenue({ branchId, ...revenuePeriod }),
    enabled: Boolean(branchId),
  })
  const managers = useMemo(
    () => managersQuery.data?.data || [],
    [managersQuery.data?.data],
  )
  const managersById = useMemo(
    () => new Map(managers.map((manager) => [manager.id, manager])),
    [managers],
  )
  const dailyRevenue = useMemo(() => {
    const revenueByDate = new Map(
      (revenueQuery.data?.data || []).map((row) => [
        row.date,
        Number(row.net) || 0,
      ]),
    )

    return Array.from({ length: revenuePeriod.lastDay }, (_, index) => {
      const date = toIsoDate(
        new Date(revenuePeriod.year, revenuePeriod.month, index + 1),
      )

      return revenueByDate.get(date) || 0
    })
  }, [revenuePeriod, revenueQuery.data?.data])

  const assignMutation = useMutation({
    mutationFn: (managerId) => assignBranchManager(branchQuery.data.id, managerId),
    onSuccess: () => {
      toast.success('Đã gán quản lý chi nhánh.')
      setManagerDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      queryClient.invalidateQueries({ queryKey: ['branches', branchId] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  if (branchQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="empty-state">Đang tải thông tin chi nhánh...</div>
      </DashboardLayout>
    )
  }

  if (branchQuery.isError) {
    return (
      <DashboardLayout>
        <div className="error-state" role="alert">
          {getApiErrorMessage(branchQuery.error)}
        </div>
      </DashboardLayout>
    )
  }

  const branch = branchQuery.data
  const managerName =
    managerQuery.data?.fullName || getManagerName(branch, managersById)
  const staffCount = staffQuery.data?.length ?? 0
  const monthlyRevenue = dailyRevenue.reduce((total, value) => total + value, 0)
  const chartMaximum = roundChartMaximum(Math.max(...dailyRevenue, 0))
  const chartLabelMaximum = monthlyRevenue > 0 ? chartMaximum : 0
  const chartPoints = dailyRevenue
    .map((value, index) => {
      const x = 36 + (index * 338) / Math.max(dailyRevenue.length - 1, 1)
      const y = 126 - (value / chartMaximum) * 100

      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const chartDays = Array.from(
    new Set([0, 4, 9, 14, 19, 24, dailyRevenue.length - 1]),
  ).filter((index) => index >= 0 && index < dailyRevenue.length)
  const summaryItems = [
    ['Tổng nhân sự', staffCount],
    ['Tổng số thuốc', '—'],
    ['Tổng giá trị tồn kho', '—'],
    ['Doanh thu tháng', formatCurrency(monthlyRevenue)],
  ]

  return (
    <DashboardLayout>
      <div className="branch-detail-page">
        <section className="branch-detail-card" aria-labelledby="branch-detail-title">
          <header className="branch-detail-header">
            <Link className="btn btn-outline branch-detail-back" to="/branches">
              <ArrowLeft size={15} aria-hidden="true" />
              Quay lại danh sách
            </Link>
            <h1 id="branch-detail-title">Chi tiết chi nhánh</h1>
            <span aria-hidden="true" />
          </header>

          <div className="branch-detail-information">
            <div className="branch-detail-image" role="img" aria-label="Hình ảnh chi nhánh">
              {branch.imageUrl ? <img src={getBranchImageUrl(branch)} alt={branch.name} /> : <span>Hình ảnh chi nhánh</span>}
            </div>

            <dl className="branch-detail-fields">
              <div>
                <dt>Tên chi nhánh</dt>
                <dd>{branch.name}</dd>
              </div>
              <div>
                <dt>Địa chỉ</dt>
                <dd>{branch.address}</dd>
              </div>
              <div>
                <dt>Số điện thoại</dt>
                <dd className="mono">{branch.phone}</dd>
              </div>
              <div>
                <dt>Trạng thái</dt>
                <dd>
                  <span className={`branch-detail-status ${branch.status === 'ACTIVE' ? 'is-active' : 'is-inactive'}`}>
                    {branch.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Quản lý</dt>
                <dd>{managerName}</dd>
              </div>
              <div>
                <dt>Ngày tạo</dt>
                <dd>{formatDateTime(branch.createdAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="branch-detail-overview">
            <section className="branch-performance-panel" aria-labelledby="branch-performance-title">
              <h2 id="branch-performance-title">
                Doanh thu <span>(Tháng này)</span>
              </h2>
              <svg viewBox="0 0 390 175" role="img" aria-label="Daily branch revenue in VND for the current month">
                <line className="branch-chart-grid" x1="36" y1="16" x2="374" y2="16" />
                <line className="branch-chart-grid" x1="36" y1="73" x2="374" y2="73" />
                <line className="branch-chart-axis" x1="36" y1="16" x2="36" y2="130" />
                <line className="branch-chart-axis" x1="36" y1="130" x2="374" y2="130" />
                <polyline points={chartPoints} />
                <text x="2" y="22">{formatChartAxis(chartLabelMaximum)}</text>
                <text x="2" y="78">{formatChartAxis(chartLabelMaximum / 2)}</text>
                <text x="25" y="135">0</text>
                {chartDays.map((index) => {
                  const x = 36 + (index * 338) / Math.max(dailyRevenue.length - 1, 1)

                  return (
                    <text key={index} x={x} y="147" textAnchor="middle">
                      {index + 1}
                    </text>
                  )
                })}
                <text className="branch-chart-axis-label" x="205" y="169" textAnchor="middle">
                  Ngày trong tháng
                </text>
                <text className="branch-chart-axis-label" x="36" y="10">
                  Doanh thu (VNĐ)
                </text>
              </svg>
              {revenueQuery.isLoading ? (
                <p className="branch-performance-note">Đang tải dữ liệu doanh thu...</p>
              ) : revenueQuery.isError ? (
                <p className="branch-performance-note">Dữ liệu doanh thu hiện chưa sẵn sàng.</p>
              ) : monthlyRevenue === 0 ? (
                <p className="branch-performance-note">Chưa có đơn đã thanh toán trong tháng này.</p>
              ) : null}
            </section>

            <section className="branch-summary-panel" aria-labelledby="branch-summary-title">
              <h2 id="branch-summary-title">Tổng quan</h2>
              <dl>
                {summaryItems.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd className="mono">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <footer className="branch-detail-actions">
            <button
              className="btn btn-outline"
              type="button"
              disabled={branch.status !== 'ACTIVE'}
              onClick={() => setManagerDialogOpen(true)}
            >
              Gán quản lý
            </button>
            <Link className="btn btn-outline" to={`/branches/${branch.id}/edit`}>
              Chỉnh sửa
            </Link>
            <Link className="btn btn-outline" to="/branches">
              Đóng
            </Link>
          </footer>
        </section>
      </div>

      <AssignManagerDialog
        branch={managerDialogOpen ? branch : null}
        managers={managers}
        isPending={assignMutation.isPending}
        onClose={() => setManagerDialogOpen(false)}
        onConfirm={(managerId) => assignMutation.mutate(managerId)}
      />
    </DashboardLayout>
  )
}
