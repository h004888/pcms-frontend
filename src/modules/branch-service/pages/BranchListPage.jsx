import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Eye,
  Pencil,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { StatusBadge } from '@shared/ui/StatusBadge.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import {
  assignBranchManager,
  deactivateBranch,
  listBranchManagers,
  listBranches,
  updateBranch,
} from '../api/branchApi.js'
import { AssignManagerDialog } from '../components/AssignManagerDialog.jsx'
import { BranchStatusDialog } from '../components/BranchStatusDialog.jsx'
import {
  formatDateTime,
  getManagerName,
  normalizeSearch,
} from '../services/branchFormatters.js'

const PAGE_SIZE = 10

export function BranchListPage() {
  const queryClient = useQueryClient()
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const [managerBranch, setManagerBranch] = useState(null)
  const [statusBranch, setStatusBranch] = useState(null)

  const branchesQuery = useQuery({
    queryKey: ['branches'],
    queryFn: () => listBranches({ page: 0, size: 100 }),
  })
  const managersQuery = useQuery({
    queryKey: ['branch-managers'],
    queryFn: () => listBranchManagers({ page: 0, size: 100 }),
  })
  const managers = useMemo(
    () => managersQuery.data?.data || [],
    [managersQuery.data?.data],
  )
  const managersById = useMemo(
    () => new Map(managers.map((manager) => [manager.id, manager])),
    [managers],
  )

  const assignMutation = useMutation({
    mutationFn: (managerId) => assignBranchManager(managerBranch.id, managerId),
    onSuccess: () => {
      toast.success('Đã gán quản lý chi nhánh.')
      setManagerBranch(null)
      queryClient.invalidateQueries({ queryKey: ['branches'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const statusMutation = useMutation({
    mutationFn: ({ branch }) =>
      branch.status === 'ACTIVE'
        ? deactivateBranch(branch.id)
        : updateBranch(branch.id, { status: 'ACTIVE' }),
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái chi nhánh.')
      setStatusBranch(null)
      queryClient.invalidateQueries({ queryKey: ['branches'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const branches = useMemo(
    () => branchesQuery.data?.data || [],
    [branchesQuery.data?.data],
  )
  const filteredBranches = useMemo(() => {
    const keyword = normalizeSearch(appliedSearch)

    return branches.filter((branch) => {
      const matchesStatus =
        statusFilter === 'ALL' || branch.status === statusFilter
      const matchesSearch =
        !keyword ||
        [branch.code, branch.name, branch.address, branch.phone]
          .filter(Boolean)
          .some((value) => normalizeSearch(String(value)).includes(keyword))

      return matchesStatus && matchesSearch
    })
  }, [branches, appliedSearch, statusFilter])
  const totalPages = Math.max(1, Math.ceil(filteredBranches.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filteredBranches.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  function handleSearch(event) {
    event.preventDefault()
    setAppliedSearch(searchInput)
    setPage(1)
  }

  function handleReset() {
    setSearchInput('')
    setAppliedSearch('')
    setStatusFilter('ALL')
    setPage(1)
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">Quản lý chi nhánh</h1>
            <p className="page-description">
              Theo dõi danh sách chi nhánh, tạo mới, chỉnh sửa thông tin,
              phân công quản lý và cập nhật trạng thái hoạt động.
            </p>
          </div>

          <Link className="btn btn-primary" to="/branches/new">
            <Plus size={16} aria-hidden="true" />
            Thêm chi nhánh
          </Link>
        </header>

        <section className="card" aria-labelledby="branch-filter-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="branch-filter-title">
                Bộ lọc
              </h2>
              <p className="card-subtitle">
                Tìm theo mã, tên, địa chỉ hoặc số điện thoại.
              </p>
            </div>
            <button className="btn btn-outline" type="button" onClick={handleReset}>
              <RotateCcw size={16} aria-hidden="true" />
              Đặt lại
            </button>
          </div>

          <form className="card-body toolbar" onSubmit={handleSearch}>
            <label className="field">
              <span className="field-label">Tìm chi nhánh</span>
              <input
                className="input"
                maxLength={100}
                value={searchInput}
                placeholder="VD: CN001, Hà Nội, 090..."
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </label>

            <label className="field">
              <span className="field-label">Trạng thái</span>
              <select
                className="select"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value)
                  setPage(1)
                }}
              >
                <option value="ALL">Tất cả</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Ngưng hoạt động</option>
              </select>
            </label>

            <button className="btn btn-primary" type="submit">
              <Search size={16} aria-hidden="true" />
              Tìm kiếm
            </button>

            <button
              className="btn btn-outline"
              type="button"
              onClick={() => branchesQuery.refetch()}
            >
              <RefreshCcw size={16} aria-hidden="true" />
              Tải lại
            </button>
          </form>
        </section>

        <section className="card" aria-labelledby="branch-list-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="branch-list-title">
                Danh sách chi nhánh
              </h2>
              <p className="card-subtitle">
                {filteredBranches.length} chi nhánh phù hợp.
              </p>
            </div>
          </div>

          {branchesQuery.isLoading ? (
            <div className="empty-state">Đang tải danh sách chi nhánh...</div>
          ) : branchesQuery.isError ? (
            <div className="card-body">
              <div className="error-state" role="alert">
                {getApiErrorMessage(branchesQuery.error)}
              </div>
            </div>
          ) : pageRows.length === 0 ? (
            <div className="empty-state">Không tìm thấy chi nhánh.</div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mã</th>
                      <th>Tên chi nhánh</th>
                      <th>Địa chỉ</th>
                      <th>Quản lý</th>
                      <th>Số điện thoại</th>
                      <th>Trạng thái</th>
                      <th>Cập nhật</th>
                      <th aria-label="Thao tác" />
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((branch) => (
                      <tr key={branch.id}>
                        <td className="mono">{branch.code}</td>
                        <td>
                          <strong>{branch.name}</strong>
                        </td>
                        <td>{branch.address}</td>
                        <td>{getManagerName(branch, managersById)}</td>
                        <td className="mono">{branch.phone}</td>
                        <td>
                          <StatusBadge status={branch.status} />
                        </td>
                        <td>{formatDateTime(branch.updatedAt)}</td>
                        <td>
                          <div className="table-actions">
                            <Link
                              className="btn btn-outline btn-icon"
                              to={`/branches/${branch.id}`}
                              title="Xem chi tiết"
                              aria-label={`Xem chi tiết ${branch.name}`}
                            >
                              <Eye size={16} aria-hidden="true" />
                            </Link>
                            <Link
                              className="btn btn-outline btn-icon"
                              to={`/branches/${branch.id}/edit`}
                              title="Chỉnh sửa"
                              aria-label={`Chỉnh sửa ${branch.name}`}
                            >
                              <Pencil size={16} aria-hidden="true" />
                            </Link>
                            <button
                              className="btn btn-outline btn-icon"
                              type="button"
                              title="Gán quản lý"
                              aria-label={`Gán quản lý ${branch.name}`}
                              disabled={branch.status !== 'ACTIVE'}
                              onClick={() => setManagerBranch(branch)}
                            >
                              <ShieldCheck size={16} aria-hidden="true" />
                            </button>
                            <button
                              className="btn btn-outline btn-icon"
                              type="button"
                              title={
                                branch.status === 'ACTIVE'
                                  ? 'Ngưng hoạt động'
                                  : 'Kích hoạt'
                              }
                              aria-label={
                                branch.status === 'ACTIVE'
                                  ? `Ngưng hoạt động ${branch.name}`
                                  : `Kích hoạt ${branch.name}`
                              }
                              onClick={() => setStatusBranch(branch)}
                            >
                              {branch.status === 'ACTIVE' ? (
                                <ToggleRight size={16} aria-hidden="true" />
                              ) : (
                                <ToggleLeft size={16} aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <span className="card-subtitle">
                  Trang {safePage}/{totalPages}
                </span>
                <div className="pagination-actions">
                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    Trước
                  </button>
                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                  >
                    Sau
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <AssignManagerDialog
        branch={managerBranch}
        managers={managers}
        isPending={assignMutation.isPending}
        onClose={() => setManagerBranch(null)}
        onConfirm={(managerId) => assignMutation.mutate(managerId)}
      />
      <BranchStatusDialog
        branch={statusBranch}
        isPending={statusMutation.isPending}
        onClose={() => setStatusBranch(null)}
        onConfirm={(payload) => statusMutation.mutate(payload)}
      />
    </DashboardLayout>
  )
}
