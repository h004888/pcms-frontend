import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Check, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listBranches } from '@modules/branch-service/api/branchApi.js'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { listMovementReport } from '../api/inventoryApi.js'
import { formatDateTime, shortId, unwrapList } from '../services/inventoryFormatters.js'

const INITIAL_FILTERS = {
  status: 'ALL',
  sourceBranchId: 'ALL',
  destinationBranchId: 'ALL',
}

function getDestinationBranchName(row, branchesById) {
  if (!row.refId) return '—'

  return branchesById.get(row.refId)?.name || shortId(row.refId)
}

export function InventoryTransferApprovalPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS)
  const [approvalNote, setApprovalNote] = useState('')

  const transfersQuery = useQuery({
    queryKey: ['inventory-transfer-review', appliedFilters.sourceBranchId],
    queryFn: () => listMovementReport({
      branchId: appliedFilters.sourceBranchId === 'ALL'
        ? undefined
        : appliedFilters.sourceBranchId,
      type: 'TRANSFER_OUT',
    }),
  })
  const branchesQuery = useQuery({
    queryKey: ['branches'],
    queryFn: () => listBranches({ page: 0, size: 100 }),
  })

  const branches = useMemo(() => unwrapList(branchesQuery.data), [branchesQuery.data])
  const branchesById = useMemo(
    () => new Map(branches.map((branch) => [branch.id, branch])),
    [branches],
  )
  const rows = useMemo(() => {
    return unwrapList(transfersQuery.data).filter((row) => {
      const matchesDestination =
        appliedFilters.destinationBranchId === 'ALL' ||
        row.refId === appliedFilters.destinationBranchId
      const matchesStatus =
        appliedFilters.status === 'ALL' || appliedFilters.status === 'COMPLETED'

      return matchesDestination && matchesStatus
    })
  }, [appliedFilters.destinationBranchId, appliedFilters.status, transfersQuery.data])

  function setFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  function handleSearch(event) {
    event.preventDefault()
    setAppliedFilters(filters)
  }

  return (
    <DashboardLayout>
      <div className="page-stack transfer-approval-page">
        <header className="page-header transfer-approval-heading">
          <div>
            <h1 className="page-title">Phê duyệt điều chuyển</h1>
            <p className="page-description">
              Xem lại các yêu cầu điều chuyển kho giữa các chi nhánh.
            </p>
          </div>
        </header>

        <form className="transfer-approval-filter" onSubmit={handleSearch}>
          <label className="field">
            <span className="field-label">Trạng thái</span>
            <select
              className="select"
              value={filters.status}
              onChange={(event) => setFilter('status', event.target.value)}
            >
              <option value="ALL">Tất cả</option>
              <option value="COMPLETED">Đã xử lý</option>
            </select>
          </label>

          <label className="field">
            <span className="field-label">Chi nhánh nguồn</span>
            <select
              className="select"
              value={filters.sourceBranchId}
              onChange={(event) => setFilter('sourceBranchId', event.target.value)}
            >
              <option value="ALL">Tất cả chi nhánh</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">Chi nhánh đích</span>
            <select
              className="select"
              value={filters.destinationBranchId}
              onChange={(event) => setFilter('destinationBranchId', event.target.value)}
            >
              <option value="ALL">Tất cả chi nhánh</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </label>

          <button className="btn btn-outline" type="submit">
            <Search size={16} aria-hidden="true" />
            Tìm
          </button>
        </form>

        <section className="transfer-approval-table-card" aria-label="Danh sách điều chuyển">
          {transfersQuery.isLoading ? (
            <div className="empty-state">Đang tải yêu cầu điều chuyển...</div>
          ) : null}
          {transfersQuery.isError ? (
            <div className="error-state" role="alert">
              {getApiErrorMessage(transfersQuery.error)}
            </div>
          ) : null}
          {!transfersQuery.isLoading && !transfersQuery.isError && rows.length === 0 ? (
            <div className="empty-state">Không có yêu cầu điều chuyển phù hợp.</div>
          ) : null}
          {!transfersQuery.isLoading && !transfersQuery.isError && rows.length > 0 ? (
            <div className="table-wrap">
              <table className="table transfer-approval-table">
                <thead>
                  <tr>
                    <th>Mã yêu cầu</th>
                    <th>Chi nhánh nguồn</th>
                    <th>Chi nhánh đích</th>
                    <th>Thuốc</th>
                    <th>Số lô</th>
                    <th>SL</th>
                    <th>Người yêu cầu</th>
                    <th>Ngày yêu cầu</th>
                    <th>Trạng thái</th>
                    <th aria-label="Thao tác" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.transactionId}>
                      <td className="mono">TRF-{shortId(row.transactionId)}</td>
                      <td>{row.branchName || shortId(row.branchId)}</td>
                      <td>{getDestinationBranchName(row, branchesById)}</td>
                      <td><strong>{row.medicineName || shortId(row.medicineId)}</strong></td>
                      <td className="mono">{row.batchNo || '—'}</td>
                      <td className="mono">{Math.abs(row.qty || 0)}</td>
                      <td className="mono">{shortId(row.actorId)}</td>
                      <td className="mono">{formatDateTime(row.createdAt)}</td>
                      <td><span className="status-badge status-ok">Đã xử lý</span></td>
                      <td>
                        <div className="transfer-approval-row-actions" title="Điều chuyển đã được hệ thống xử lý ngay khi tạo.">
                          <button className="btn btn-outline approval-icon-button" type="button" disabled aria-label="Đã phê duyệt">
                            <Check size={16} aria-hidden="true" />
                          </button>
                          <button className="btn btn-outline approval-icon-button" type="button" disabled aria-label="Không thể từ chối">
                            <X size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        <section className="transfer-approval-note">
          <label className="field">
            <span className="field-label">Ghi chú phê duyệt (không bắt buộc)</span>
            <textarea
              className="textarea"
              value={approvalNote}
              placeholder="Nhập ghi chú phê duyệt hoặc từ chối (không bắt buộc)..."
              onChange={(event) => setApprovalNote(event.target.value)}
            />
          </label>
        </section>

        <div className="transfer-approval-actions">
          <Link className="btn btn-outline" to="/inventory">Đóng</Link>
          <button className="btn btn-outline" type="button" disabled title="BE chưa có luồng từ chối điều chuyển.">Từ chối</button>
          <button className="btn btn-primary" type="button" disabled title="BE xử lý điều chuyển ngay khi tạo.">Phê duyệt</button>
        </div>
      </div>
    </DashboardLayout>
  )
}
