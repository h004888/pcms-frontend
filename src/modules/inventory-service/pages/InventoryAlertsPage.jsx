import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, ArrowDown, Check, CircleX, Clock3, Eye, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listBranches } from '@modules/branch-service/api/branchApi.js'
import { listMedicines } from '@modules/catalog-service/api/medicineApi.js'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { listExpiryAlerts, listLowStockAlerts } from '../api/inventoryApi.js'
import {
  daysUntil,
  formatDate,
  getBatchQuantity,
  getMinimumStock,
  shortId,
  unwrapList,
} from '../services/inventoryFormatters.js'

const PAGE_SIZE = 5
const ALERT_LABELS = {
  LOW_STOCK: 'Tồn thấp',
  OUT_OF_STOCK: 'Hết hàng',
  EXPIRING: 'Sắp hết hạn',
  EXPIRED: 'Đã quá hạn',
}
const INITIAL_FILTERS = {
  type: 'ALL',
  branchId: 'ALL',
  search: '',
  status: 'ALL',
}

function getAlertKey(row) {
  return `${row.id}-${row.alertType}`
}

function getSeverity(type, remainingDays) {
  if (type === 'OUT_OF_STOCK' || type === 'EXPIRED' || remainingDays <= 7) {
    return 'Cao'
  }

  if (type === 'LOW_STOCK' || type === 'EXPIRING') return 'Trung bình'

  return 'Thấp'
}

function getAlertIcon(type) {
  if (type === 'LOW_STOCK') return <ArrowDown size={17} aria-hidden="true" />
  if (type === 'OUT_OF_STOCK') return <CircleX size={17} aria-hidden="true" />
  if (type === 'EXPIRING') return <Clock3 size={17} aria-hidden="true" />

  return <AlertTriangle size={17} aria-hidden="true" />
}

export function InventoryAlertsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS)
  const [resolvedAlertKeys, setResolvedAlertKeys] = useState(() => new Set())
  const [page, setPage] = useState(1)

  const lowStockQuery = useQuery({
    queryKey: ['inventory-alerts', 'low-stock'],
    queryFn: listLowStockAlerts,
  })
  const expiryQuery = useQuery({
    queryKey: ['inventory-alerts', 'expiry', 30],
    queryFn: () => listExpiryAlerts(30),
  })
  const branchesQuery = useQuery({
    queryKey: ['branches'],
    queryFn: () => listBranches({ page: 0, size: 100 }),
  })
  const medicinesQuery = useQuery({
    queryKey: ['medicines'],
    queryFn: () => listMedicines({ page: 0, size: 100 }),
  })

  const branches = useMemo(() => unwrapList(branchesQuery.data), [branchesQuery.data])
  const branchesById = useMemo(
    () => new Map(branches.map((branch) => [branch.id, branch])),
    [branches],
  )
  const medicinesById = useMemo(
    () => new Map(unwrapList(medicinesQuery.data).map((medicine) => [medicine.id, medicine])),
    [medicinesQuery.data],
  )
  const lowRows = useMemo(() => unwrapList(lowStockQuery.data), [lowStockQuery.data])
  const expiryRows = useMemo(() => unwrapList(expiryQuery.data), [expiryQuery.data])
  const alerts = useMemo(() => {
    const byKey = new Map()

    for (const row of lowRows) {
      const alertType = getBatchQuantity(row) <= 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK'
      byKey.set(`${row.id}-${alertType}`, { ...row, alertType })
    }
    for (const row of expiryRows) {
      const alertType = daysUntil(row.expiryDate) < 0 ? 'EXPIRED' : 'EXPIRING'
      byKey.set(`${row.id}-${alertType}`, { ...row, alertType })
    }

    return Array.from(byKey.values())
  }, [expiryRows, lowRows])
  const rows = useMemo(() => {
    const keyword = appliedFilters.search.trim().toLowerCase()

    return alerts.filter((row) => {
      const key = getAlertKey(row)
      const medicine = medicinesById.get(row.medicineId)
      const isResolved = resolvedAlertKeys.has(key)
      const matchesStatus =
        appliedFilters.status === 'ALL' ||
        (appliedFilters.status === 'ACTIVE' && !isResolved) ||
        (appliedFilters.status === 'RESOLVED' && isResolved)

      return (
        (appliedFilters.type === 'ALL' || row.alertType === appliedFilters.type) &&
        (appliedFilters.branchId === 'ALL' || row.branchId === appliedFilters.branchId) &&
        matchesStatus &&
        (!keyword || [row.batchNo, medicine?.name, branchesById.get(row.branchId)?.name]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(keyword)))
      )
    })
  }, [alerts, appliedFilters, branchesById, medicinesById, resolvedAlertKeys])
  const stats = useMemo(() => ({
    low: lowRows.filter((row) => getBatchQuantity(row) > 0).length,
    out: lowRows.filter((row) => getBatchQuantity(row) <= 0).length,
    expiring: expiryRows.filter((row) => daysUntil(row.expiryDate) >= 0).length,
    expired: expiryRows.filter((row) => daysUntil(row.expiryDate) < 0).length,
  }), [expiryRows, lowRows])
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const isLoading = lowStockQuery.isLoading || expiryQuery.isLoading
  const error = lowStockQuery.error || expiryQuery.error

  function setFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  function handleSearch(event) {
    event.preventDefault()
    setAppliedFilters(filters)
    setPage(1)
  }

  function resolveAlert(key) {
    setResolvedAlertKeys((current) => new Set([...current, key]))
  }

  return (
    <DashboardLayout>
      <div className="page-stack inventory-alert-page">
        <header className="page-header inventory-alert-heading">
          <h1 className="page-title">Cảnh báo tồn kho</h1>
        </header>

        <section className="inventory-alert-summary" aria-label="Tổng quan cảnh báo">
          <AlertCard icon={<AlertTriangle />} label="Tồn thấp" value={stats.low} />
          <AlertCard icon={<CircleX />} label="Hết hàng" value={stats.out} />
          <AlertCard icon={<Clock3 />} label="Sắp hết hạn" value={stats.expiring} />
          <AlertCard icon={<AlertTriangle />} label="Đã quá hạn" value={stats.expired} />
        </section>

        <section className="inventory-alert-filter-card" aria-label="Bộ lọc cảnh báo">
          <form className="inventory-alert-filter" onSubmit={handleSearch}>
            <label className="field">
              <span className="field-label">Loại cảnh báo</span>
              <select className="select" value={filters.type} onChange={(event) => setFilter('type', event.target.value)}>
                <option value="ALL">Tất cả</option>
                {Object.entries(ALERT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Chi nhánh</span>
              <select className="select" value={filters.branchId} onChange={(event) => setFilter('branchId', event.target.value)}>
                <option value="ALL">Tất cả chi nhánh</option>
                {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Thuốc</span>
              <input className="input" value={filters.search} placeholder="Tìm theo thuốc, mã hoặc số lô..." onChange={(event) => setFilter('search', event.target.value)} />
            </label>
            <label className="field">
              <span className="field-label">Trạng thái cảnh báo</span>
              <select className="select" value={filters.status} onChange={(event) => setFilter('status', event.target.value)}>
                <option value="ALL">Tất cả</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="RESOLVED">Đã xử lý</option>
              </select>
            </label>
            <button className="btn btn-outline" type="submit"><Search size={16} aria-hidden="true" />Tìm</button>
          </form>
        </section>

        <section className="inventory-alert-table-card" aria-label="Danh sách cảnh báo">
          {isLoading ? <div className="empty-state">Đang tải cảnh báo tồn kho...</div> : null}
          {error ? <div className="error-state" role="alert">{getApiErrorMessage(error)}</div> : null}
          {!isLoading && !error && rows.length === 0 ? <div className="empty-state">Không có cảnh báo phù hợp.</div> : null}
          {!isLoading && !error && rows.length > 0 ? (
            <>
              <div className="table-wrap">
                <table className="table inventory-alert-table">
                  <thead><tr><th>Loại cảnh báo</th><th>Chi nhánh</th><th>Thuốc</th><th>Tồn hiện tại</th><th>Tối thiểu</th><th>Số lô</th><th>Hạn dùng</th><th>Ngày còn lại</th><th>Mức độ</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                  <tbody>{pageRows.map((row) => {
                    const key = getAlertKey(row)
                    const isResolved = resolvedAlertKeys.has(key)
                    const remainingDays = daysUntil(row.expiryDate)
                    const medicine = medicinesById.get(row.medicineId)

                    return <tr key={key}>
                      <td><span className={`alert-type-label alert-type-${row.alertType.toLowerCase()}`}>{getAlertIcon(row.alertType)}{ALERT_LABELS[row.alertType]}</span></td>
                      <td>{branchesById.get(row.branchId)?.name || shortId(row.branchId)}</td>
                      <td><strong>{medicine?.name || shortId(row.medicineId)}</strong><div className="card-subtitle mono">{shortId(row.medicineId)}</div></td>
                      <td className="mono">{getBatchQuantity(row)}</td>
                      <td className="mono">{getMinimumStock(row)}</td>
                      <td className="mono">{row.batchNo || '—'}</td>
                      <td className="mono">{formatDate(row.expiryDate)}</td>
                      <td className="mono">{Number.isFinite(remainingDays) ? remainingDays : '—'}</td>
                      <td><span className="severity-badge">{getSeverity(row.alertType, remainingDays)}</span></td>
                      <td><span className={`status-badge ${isResolved ? 'status-ok' : 'status-warning'}`}>{isResolved ? 'Đã xử lý' : 'Đang hoạt động'}</span></td>
                      <td><div className="inventory-alert-actions"><Link className="btn btn-outline btn-compact" to={`/inventory/batches/${row.id}`}>Chi tiết</Link><button className="btn btn-outline btn-compact" type="button" disabled={isResolved} onClick={() => resolveAlert(key)}>{isResolved ? <Check size={15} aria-hidden="true" /> : null}{isResolved ? 'Đã xử lý' : 'Xử lý'}</button></div></td>
                    </tr>
                  })}</tbody>
                </table>
              </div>
              <div className="inventory-alert-pagination">
                <span>Hiển thị {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, rows.length)} trên {rows.length} cảnh báo</span>
                <div className="pagination-actions">
                  <button className="btn btn-outline btn-compact" type="button" disabled={safePage === 1} onClick={() => setPage(1)}>Đầu</button>
                  <button className="btn btn-outline btn-compact" type="button" disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Trước</button>
                  <span className="page-current mono">{safePage}</span>
                  <button className="btn btn-outline btn-compact" type="button" disabled={safePage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Sau</button>
                  <button className="btn btn-outline btn-compact" type="button" disabled={safePage === totalPages} onClick={() => setPage(totalPages)}>Cuối</button>
                </div>
              </div>
            </>
          ) : null}
        </section>
      </div>
    </DashboardLayout>
  )
}

function AlertCard({ icon, label, value }) {
  return <div className="inventory-alert-card"><span className="inventory-alert-card-icon" aria-hidden="true">{icon}</span><div><p>{label}</p><strong className="mono">{value}</strong><small>Mặt hàng</small></div></div>
}
