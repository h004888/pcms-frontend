import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRightLeft,
  ArrowUpFromLine,
  CalendarClock,
  History,
  PackageCheck,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listBranches } from '@modules/branch-service/api/branchApi.js'
import { listMedicines } from '@modules/catalog-service/api/medicineApi.js'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { StockStatusBadge } from '../components/StockStatusBadge.jsx'
import {
  getInventoryBatch,
  listBatchTransactions,
} from '../api/inventoryApi.js'
import {
  formatDate,
  formatDateTime,
  getBatchQuantity,
  getMinimumStock,
  getTransactionLabel,
  isOutgoingTransaction,
  shortId,
  unwrapList,
} from '../services/inventoryFormatters.js'

function DetailText({ label, value, mono = false }) {
  return (
    <div className="detail-item">
      <span className="detail-label">{label}</span>
      <span className={mono ? 'detail-value mono' : 'detail-value'}>
        {value || '--'}
      </span>
    </div>
  )
}

export function InventoryBatchDetailPage() {
  const { batchId } = useParams()

  const batchQuery = useQuery({
    queryKey: ['inventory-batches', batchId],
    queryFn: () => getInventoryBatch(batchId),
    enabled: Boolean(batchId),
  })
  const transactionsQuery = useQuery({
    queryKey: ['inventory-batches', batchId, 'transactions'],
    queryFn: () => listBatchTransactions(batchId),
    enabled: Boolean(batchId),
  })
  const branchesQuery = useQuery({
    queryKey: ['branches'],
    queryFn: () => listBranches({ page: 0, size: 100 }),
  })
  const medicinesQuery = useQuery({
    queryKey: ['medicines'],
    queryFn: () => listMedicines({ page: 0, size: 100 }),
  })

  const branchesById = useMemo(() => {
    return new Map(unwrapList(branchesQuery.data).map((branch) => [branch.id, branch]))
  }, [branchesQuery.data])
  const medicinesById = useMemo(() => {
    return new Map(
      unwrapList(medicinesQuery.data).map((medicine) => [medicine.id, medicine]),
    )
  }, [medicinesQuery.data])
  const transactions = useMemo(
    () => unwrapList(transactionsQuery.data),
    [transactionsQuery.data],
  )

  if (batchQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="empty-state">Đang tải chi tiết lô...</div>
      </DashboardLayout>
    )
  }

  if (batchQuery.isError) {
    return (
      <DashboardLayout>
        <div className="error-state" role="alert">
          {getApiErrorMessage(batchQuery.error)}
        </div>
      </DashboardLayout>
    )
  }

  const batch = batchQuery.data
  const medicine = medicinesById.get(batch.medicineId)
  const branch = branchesById.get(batch.branchId)

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">Chi tiết tồn kho</h1>
            <p className="page-description">
              Lô <span className="mono">{batch.batchNo}</span> tại{' '}
              {branch?.name || shortId(batch.branchId)}
            </p>
          </div>

          <div className="table-actions">
            <Link className="btn btn-outline" to="/inventory/stocks">
              <ArrowLeft size={16} aria-hidden="true" />
              Quay lại danh sách
            </Link>
            <Link className="btn btn-primary" to="/inventory/export">
              <ArrowUpFromLine size={16} aria-hidden="true" />
              Xuất kho
            </Link>
          </div>
        </header>

        <div className="detail-grid inventory-detail-grid">
          <section className="card inventory-detail-summary" aria-labelledby="batch-detail-title">
            <div className="card-header">
              <div>
                <h2 className="card-title" id="batch-detail-title">
                  Thông tin tồn kho
                </h2>
                <p className="card-subtitle">
                  Tóm tắt thuốc, chi nhánh và tồn kho hiện tại.
                </p>
              </div>
              <StockStatusBadge row={batch} />
            </div>

            <div className="card-body detail-list">
              <DetailText label="Tên thuốc" value={medicine?.name || shortId(batch.medicineId)} />
              <DetailText label="Danh mục" value={medicine?.categoryName || shortId(medicine?.categoryId)} />
              <DetailText label="Đơn vị" value={medicine?.unit || 'Đơn vị'} />
              <DetailText label="Chi nhánh" value={branch?.name || shortId(batch.branchId)} />
              <DetailText label="Tổng tồn" value={String(getBatchQuantity(batch))} mono />
            </div>

            <div className="form-actions">
              <Link className="btn btn-outline" to="/inventory/import">
                <ArrowDownToLine size={16} aria-hidden="true" />
                Nhập lô mới
              </Link>
              <Link className="btn btn-outline" to="/inventory/transfer">
                <ArrowRightLeft size={16} aria-hidden="true" />
                Chuyển kho
              </Link>
            </div>
          </section>

          <aside className="stat-grid inventory-detail-stats" aria-label="Chỉ số lô">
            <div className="stat-card">
              <div>
                <p className="stat-title">Tồn hiện tại</p>
                <p className="stat-value mono">{getBatchQuantity(batch)}</p>
              </div>
              <PackageCheck color="var(--accent-700)" size={22} aria-hidden="true" />
            </div>
            <div className="stat-card">
              <div>
                <p className="stat-title">Tồn tối thiểu</p>
                <p className="stat-value mono">{getMinimumStock(batch)}</p>
              </div>
              <PackageCheck color="var(--ink-500)" size={22} aria-hidden="true" />
            </div>
            <div className="stat-card">
              <div>
                <p className="stat-title">Hạn dùng</p>
                <p className="stat-value" style={{ fontSize: 18 }}>
                  {formatDate(batch.expiryDate)}
                </p>
              </div>
              <CalendarClock color="var(--warning-700)" size={22} aria-hidden="true" />
            </div>
          </aside>
        </div>

        <section className="card inventory-batch-stock-card" aria-labelledby="batch-stock-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="batch-stock-title">Chi tiết lô hàng</h2>
              <p className="card-subtitle">Số lượng tồn khả dụng theo lô đang xem.</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Số lô</th>
                  <th>Hạn dùng</th>
                  <th>Khả dụng</th>
                  <th>Đã giữ</th>
                  <th>Trạng thái lô</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono">{batch.batchNo}</td>
                  <td className="mono">{formatDate(batch.expiryDate)}</td>
                  <td className="mono">{getBatchQuantity(batch)}</td>
                  <td className="mono">0</td>
                  <td><StockStatusBadge row={batch} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="card" aria-labelledby="batch-transaction-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="batch-transaction-title">
                Lịch sử giao dịch lô
              </h2>
              <p className="card-subtitle">
                Các lần nhập, xuất, bán hàng hoặc điều chuyển liên quan đến lô này.
              </p>
            </div>
            <History color="var(--accent-700)" size={22} aria-hidden="true" />
          </div>

          {transactionsQuery.isLoading ? (
            <div className="empty-state">Đang tải lịch sử lô...</div>
          ) : transactionsQuery.isError ? (
            <div className="card-body">
              <div className="error-state" role="alert">
                {getApiErrorMessage(transactionsQuery.error)}
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">Lô này chưa có giao dịch.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Loại</th>
                    <th>Số lượng</th>
                    <th>Lý do</th>
                    <th>Ref</th>
                    <th>Người thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{formatDateTime(transaction.createdAt)}</td>
                      <td>{getTransactionLabel(transaction.type)}</td>
                      <td className="mono">
                        {isOutgoingTransaction(transaction.type) ? '' : '+'}
                        {transaction.qty}
                      </td>
                      <td>{transaction.reason || '--'}</td>
                      <td className="mono">{shortId(transaction.refId)}</td>
                      <td className="mono">{shortId(transaction.actorId)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}
