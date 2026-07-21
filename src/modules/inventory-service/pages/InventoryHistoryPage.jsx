import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Search } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listBranches } from '@modules/branch-service/api/branchApi.js'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { listMovementReport } from '../api/inventoryApi.js'
import {
  formatDateTime,
  getTransactionLabel,
  isOutgoingTransaction,
  shortId,
  unwrapList,
} from '../services/inventoryFormatters.js'

const PAGE_SIZE = 10
const TRANSACTION_TYPES = [
  'IMPORT',
  'EXPORT',
  'SALE',
  'SALE_RESTORE',
  'TRANSFER_OUT',
  'TRANSFER_IN',
]
const INITIAL_FILTERS = {
  branchId: 'ALL',
  type: 'ALL',
  status: 'ALL',
  keyword: '',
  fromDate: '',
  toDate: '',
}

function csvValue(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

export function InventoryHistoryPage() {
  const [searchParams] = useSearchParams()
  const batchId = searchParams.get('batchId') || ''
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS)
  const [page, setPage] = useState(1)

  const historyQuery = useQuery({
    queryKey: ['inventory-history', appliedFilters, batchId],
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
  const rows = useMemo(() => {
    const keyword = appliedFilters.keyword.trim().toLowerCase()

    return unwrapList(historyQuery.data).filter((row) => {
      const matchesKeyword =
        !keyword ||
        [
          row.transactionId,
          row.medicineName,
          row.branchName,
          row.batchNo,
          row.reason,
          row.actorId,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(keyword))
      const matchesBatch = !batchId || row.batchId === batchId
      const matchesStatus =
        appliedFilters.status === 'ALL' || appliedFilters.status === 'COMPLETED'

      return matchesKeyword && matchesBatch && matchesStatus
    })
  }, [appliedFilters.keyword, appliedFilters.status, batchId, historyQuery.data])
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function setFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  function handleSearch(event) {
    event.preventDefault()
    setAppliedFilters(filters)
    setPage(1)
  }

  function handleExport() {
    const header = [
      'Mã giao dịch',
      'Loại',
      'Thuốc',
      'Chi nhánh',
      'Số lượng',
      'Số lô',
      'Lý do',
      'Người tạo',
      'Người xử lý',
      'Thời gian',
      'Trạng thái',
    ]
    const csvRows = rows.map((row) => [
      row.transactionId,
      getTransactionLabel(row.type),
      row.medicineName || shortId(row.medicineId),
      row.branchName || shortId(row.branchId),
      `${isOutgoingTransaction(row.type) ? '' : '+'}${row.qty ?? 0}`,
      row.batchNo || shortId(row.batchId),
      row.reason || '—',
      shortId(row.actorId),
      'Hệ thống',
      formatDateTime(row.createdAt),
      'Đã xử lý',
    ])
    const csv = [header, ...csvRows]
      .map((row) => row.map(csvValue).join(','))
      .join('\r\n')
    const file = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(file)
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = `lich-su-giao-dich-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      <div className="page-stack inventory-history-page">
        <header className="page-header inventory-history-heading">
          <h1 className="page-title">{batchId ? 'Lịch sử giao dịch của lô' : 'Lịch sử giao dịch'}</h1>
          <button className="btn btn-outline" type="button" onClick={handleExport} disabled={rows.length === 0}>
            <Download size={16} aria-hidden="true" />
            Xuất báo cáo
          </button>
        </header>

        <section className="history-filter-card" aria-label="Bộ lọc lịch sử giao dịch">
          <form className="inventory-history-filter" onSubmit={handleSearch}>
            <label className="field">
              <span className="field-label">Từ ngày</span>
              <input className="input mono" type="date" value={filters.fromDate} onChange={(event) => setFilter('fromDate', event.target.value)} />
            </label>
            <label className="field">
              <span className="field-label">Đến ngày</span>
              <input className="input mono" type="date" value={filters.toDate} onChange={(event) => setFilter('toDate', event.target.value)} />
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
              <input className="input" value={filters.keyword} placeholder="Tìm theo thuốc, lô..." onChange={(event) => setFilter('keyword', event.target.value)} />
            </label>
            <label className="field">
              <span className="field-label">Loại giao dịch</span>
              <select className="select" value={filters.type} onChange={(event) => setFilter('type', event.target.value)}>
                <option value="ALL">Tất cả loại</option>
                {TRANSACTION_TYPES.map((type) => <option key={type} value={type}>{getTransactionLabel(type)}</option>)}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Trạng thái</span>
              <select className="select" value={filters.status} onChange={(event) => setFilter('status', event.target.value)}>
                <option value="ALL">Tất cả trạng thái</option>
                <option value="COMPLETED">Đã xử lý</option>
              </select>
            </label>
            <button className="btn btn-outline" type="submit"><Search size={16} aria-hidden="true" />Tìm</button>
          </form>
        </section>

        <section className="history-table-card" aria-label="Kết quả lịch sử giao dịch">
          {historyQuery.isLoading ? <div className="empty-state">Đang tải lịch sử giao dịch...</div> : null}
          {historyQuery.isError ? <div className="error-state" role="alert">{getApiErrorMessage(historyQuery.error)}</div> : null}
          {!historyQuery.isLoading && !historyQuery.isError && rows.length === 0 ? <div className="empty-state">Không có giao dịch phù hợp.</div> : null}
          {!historyQuery.isLoading && !historyQuery.isError && rows.length > 0 ? (
            <>
              <div className="table-wrap">
                <table className="table history-table">
                  <thead><tr><th>Mã giao dịch</th><th>Loại</th><th>Thuốc</th><th>Chi nhánh</th><th>SL</th><th>Số lô</th><th>Lý do</th><th>Người tạo</th><th>Người xử lý</th><th>Thời gian</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                  <tbody>{pageRows.map((row) => (
                    <tr key={row.transactionId}>
                      <td className="mono">TXN-{shortId(row.transactionId)}</td>
                      <td>{getTransactionLabel(row.type)}</td>
                      <td><strong>{row.medicineName || shortId(row.medicineId)}</strong></td>
                      <td>{row.branchName || shortId(row.branchId)}</td>
                      <td className="mono">{isOutgoingTransaction(row.type) ? '' : '+'}{row.qty}</td>
                      <td className="mono">{row.batchNo || shortId(row.batchId)}</td>
                      <td>{row.reason || '—'}</td>
                      <td className="mono">{shortId(row.actorId)}</td>
                      <td>Hệ thống</td>
                      <td className="mono">{formatDateTime(row.createdAt)}</td>
                      <td><span className="status-badge status-ok">Đã xử lý</span></td>
                      <td><Link className="btn btn-outline btn-compact" to={`/inventory/batches/${row.batchId}`}>Chi tiết</Link></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className="history-pagination">
                <span>Hiển thị {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, rows.length)} trên {rows.length} kết quả</span>
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
