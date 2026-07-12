import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Bell, Eye, RefreshCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listBranches } from '@modules/branch-service/api/branchApi.js'
import { listMedicines } from '@modules/catalog-service/api/medicineApi.js'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { StockStatusBadge } from '../components/StockStatusBadge.jsx'
import {
  listExpiryAlerts,
  listLowStockAlerts,
} from '../api/inventoryApi.js'
import {
  formatDate,
  getBatchQuantity,
  getMinimumStock,
  shortId,
  unwrapList,
} from '../services/inventoryFormatters.js'

function AlertTable({ title, subtitle, rows, branchesById, medicinesById }) {
  return (
    <section className="card" aria-labelledby={`${title}-title`}>
      <div className="card-header">
        <div>
          <h2 className="card-title" id={`${title}-title`}>
            {title}
          </h2>
          <p className="card-subtitle">{subtitle}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="empty-state">Không có cảnh báo.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Thuốc</th>
                <th>Chi nhánh</th>
                <th>Số lô</th>
                <th>Tồn</th>
                <th>Tối thiểu</th>
                <th>Hạn dùng</th>
                <th>Trạng thái</th>
                <th aria-label="Thao tác" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>
                      {medicinesById.get(row.medicineId)?.name || shortId(row.medicineId)}
                    </strong>
                    <div className="card-subtitle mono">{shortId(row.medicineId)}</div>
                  </td>
                  <td>{branchesById.get(row.branchId)?.name || shortId(row.branchId)}</td>
                  <td className="mono">{row.batchNo}</td>
                  <td className="mono">{getBatchQuantity(row)}</td>
                  <td className="mono">{getMinimumStock(row)}</td>
                  <td className="mono">{formatDate(row.expiryDate)}</td>
                  <td>
                    <StockStatusBadge row={row} />
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        className="btn btn-outline btn-icon"
                        to={`/inventory/batches/${row.id}`}
                        title="Xem chi tiết"
                        aria-label={`Xem chi tiết lô ${row.batchNo}`}
                      >
                        <Eye size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export function InventoryAlertsPage() {
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

  const lowStockRows = useMemo(
    () => unwrapList(lowStockQuery.data),
    [lowStockQuery.data],
  )
  const expiryRows = useMemo(
    () => unwrapList(expiryQuery.data),
    [expiryQuery.data],
  )
  const branchesById = useMemo(() => {
    return new Map(unwrapList(branchesQuery.data).map((branch) => [branch.id, branch]))
  }, [branchesQuery.data])
  const medicinesById = useMemo(() => {
    return new Map(
      unwrapList(medicinesQuery.data).map((medicine) => [medicine.id, medicine]),
    )
  }, [medicinesQuery.data])
  const isLoading = lowStockQuery.isLoading || expiryQuery.isLoading
  const hasError = lowStockQuery.isError || expiryQuery.isError

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">Cảnh báo tồn kho</h1>
            <p className="page-description">
              Theo dõi lô dưới mức tối thiểu và lô sắp hết hạn trong 30 ngày.
            </p>
          </div>

          <div className="table-actions">
            <Link className="btn btn-outline" to="/inventory">
              <ArrowLeft size={16} aria-hidden="true" />
              Tồn kho
            </Link>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                lowStockQuery.refetch()
                expiryQuery.refetch()
              }}
            >
              <RefreshCcw size={16} aria-hidden="true" />
              Tải lại
            </button>
          </div>
        </header>

        <section className="inventory-stat-grid" aria-label="Tổng quan cảnh báo">
          <div className="stat-card">
            <div>
              <p className="stat-title">Dưới mức tối thiểu</p>
              <p className="stat-value mono">{lowStockRows.length}</p>
            </div>
            <Bell color="var(--warning-700)" size={22} aria-hidden="true" />
          </div>
          <div className="stat-card">
            <div>
              <p className="stat-title">Sắp hết hạn</p>
              <p className="stat-value mono">{expiryRows.length}</p>
            </div>
            <Bell color="var(--warning-700)" size={22} aria-hidden="true" />
          </div>
        </section>

        {isLoading ? (
          <div className="empty-state">Đang tải cảnh báo tồn kho...</div>
        ) : hasError ? (
          <div className="error-state" role="alert">
            {getApiErrorMessage(lowStockQuery.error || expiryQuery.error)}
          </div>
        ) : (
          <>
            <AlertTable
              title="Cảnh báo tồn thấp"
              subtitle="Các lô đã xuống dưới mức tồn tối thiểu cần theo dõi."
              rows={lowStockRows}
              branchesById={branchesById}
              medicinesById={medicinesById}
            />
            <AlertTable
              title="Cảnh báo hạn dùng"
              subtitle="Các lô cần ưu tiên xử lý trước khi hết hạn."
              rows={expiryRows}
              branchesById={branchesById}
              medicinesById={medicinesById}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
