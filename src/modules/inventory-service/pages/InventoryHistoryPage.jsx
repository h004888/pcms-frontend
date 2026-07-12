import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, RefreshCcw, RotateCcw, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listBranches } from '@modules/branch-service/api/branchApi.js'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { listMovementReport } from '../api/inventoryApi.js'
import {
  formatDate,
  formatDateTime,
  getTransactionLabel,
  isOutgoingTransaction,
  shortId,
  unwrapList,
} from '../services/inventoryFormatters.js'

const TRANSACTION_TYPES = [
  'IMPORT',
  'EXPORT',
  'SALE',
  'SALE_RESTORE',
  'TRANSFER_OUT',
  'TRANSFER_IN',
]

export function InventoryHistoryPage() {
  const [filters, setFilters] = useState({
    branchId: 'ALL',
    type: 'ALL',
    fromDate: '',
    toDate: '',
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)

  const historyQuery = useQuery({
    queryKey: ['inventory-history', appliedFilters],
    queryFn: () =>
      listMovementReport({
        branchId:
          appliedFilters.branchId === 'ALL' ? undefined : appliedFilters.branchId,
        type: appliedFilters.type === 'ALL' ? undefined : appliedFilters.type,
        fromDate: appliedFilters.fromDate || undefined,
        toDate: appliedFilters.toDate || undefined,
      }),
  })
  const branchesQuery = useQuery({
    queryKey: ['branches'],
    queryFn: () => listBranches({ page: 0, size: 100 }),
  })

  const branches = useMemo(
    () => unwrapList(branchesQuery.data),
    [branchesQuery.data],
  )
  const rows = useMemo(
    () => unwrapList(historyQuery.data),
    [historyQuery.data],
  )

  function setFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  function handleSearch(event) {
    event.preventDefault()
    setAppliedFilters(filters)
  }

  function handleReset() {
    const nextFilters = {
      branchId: 'ALL',
      type: 'ALL',
      fromDate: '',
      toDate: '',
    }
    setFilters(nextFilters)
    setAppliedFilters(nextFilters)
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">Lịch sử giao dịch kho</h1>
            <p className="page-description">
              Theo dõi toàn bộ nhập, xuất, bán hàng và điều chuyển kho trong hệ thống.
            </p>
          </div>

          <Link className="btn btn-outline" to="/inventory">
            <ArrowLeft size={16} aria-hidden="true" />
            Tồn kho
          </Link>
        </header>

        <section className="card" aria-labelledby="history-filter-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="history-filter-title">
                Bộ lọc lịch sử
              </h2>
              <p className="card-subtitle">
                Lọc giao dịch theo chi nhánh, loại thao tác và khoảng thời gian.
              </p>
            </div>
            <button className="btn btn-outline" type="button" onClick={handleReset}>
              <RotateCcw size={16} aria-hidden="true" />
              Đặt lại
            </button>
          </div>

          <form className="card-body toolbar inventory-history-toolbar" onSubmit={handleSearch}>
            <label className="field">
              <span className="field-label">Chi nhánh</span>
              <select
                className="select"
                value={filters.branchId}
                onChange={(event) => setFilter('branchId', event.target.value)}
              >
                <option value="ALL">Tất cả</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.code ? `${branch.code} - ${branch.name}` : branch.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field-label">Loại giao dịch</span>
              <select
                className="select"
                value={filters.type}
                onChange={(event) => setFilter('type', event.target.value)}
              >
                <option value="ALL">Tất cả</option>
                {TRANSACTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {getTransactionLabel(type)}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field-label">Từ ngày</span>
              <input
                className="input mono"
                type="date"
                value={filters.fromDate}
                onChange={(event) => setFilter('fromDate', event.target.value)}
              />
            </label>

            <label className="field">
              <span className="field-label">Đến ngày</span>
              <input
                className="input mono"
                type="date"
                value={filters.toDate}
                onChange={(event) => setFilter('toDate', event.target.value)}
              />
            </label>

            <button className="btn btn-primary" type="submit">
              <Search size={16} aria-hidden="true" />
              Lọc
            </button>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => historyQuery.refetch()}
            >
              <RefreshCcw size={16} aria-hidden="true" />
              Tải lại
            </button>
          </form>
        </section>

        <section className="card" aria-labelledby="history-list-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="history-list-title">
                Giao dịch kho
              </h2>
              <p className="card-subtitle">{rows.length} giao dịch phù hợp.</p>
            </div>
          </div>

          {historyQuery.isLoading ? (
            <div className="empty-state">Đang tải lịch sử kho...</div>
          ) : historyQuery.isError ? (
            <div className="card-body">
              <div className="error-state" role="alert">
                {getApiErrorMessage(historyQuery.error)}
              </div>
            </div>
          ) : rows.length === 0 ? (
            <div className="empty-state">Không có giao dịch phù hợp.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Loại</th>
                    <th>Thuốc</th>
                    <th>Chi nhánh</th>
                    <th>Số lô</th>
                    <th>Số lượng</th>
                    <th>Hạn dùng</th>
                    <th>Lý do</th>
                    <th>Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.transactionId}>
                      <td>{formatDateTime(row.createdAt)}</td>
                      <td>{getTransactionLabel(row.type)}</td>
                      <td>
                        <strong>{row.medicineName || shortId(row.medicineId)}</strong>
                        <div className="card-subtitle mono">{shortId(row.medicineId)}</div>
                      </td>
                      <td>{row.branchName || shortId(row.branchId)}</td>
                      <td className="mono">{row.batchNo || shortId(row.batchId)}</td>
                      <td className="mono">
                        {isOutgoingTransaction(row.type) ? '' : '+'}
                        {row.qty}
                      </td>
                      <td className="mono">{formatDate(row.expiryDate)}</td>
                      <td>{row.reason || '--'}</td>
                      <td className="mono">{shortId(row.refId)}</td>
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
