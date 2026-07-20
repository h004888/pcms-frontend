import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Power,
  Search,
  UserRoundPlus,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
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
import { getManagerName, normalizeSearch } from '../services/branchFormatters.js'

const PAGE_SIZE = 5

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
  const visiblePages = useMemo(() => {
    const first = Math.min(
      Math.max(1, safePage - 2),
      Math.max(1, totalPages - 4),
    )
    const last = Math.min(totalPages, first + 4)

    return Array.from({ length: last - first + 1 }, (_, index) => first + index)
  }, [safePage, totalPages])
  const firstItem = filteredBranches.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const lastItem = Math.min(safePage * PAGE_SIZE, filteredBranches.length)

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
      <div className="branch-list-page">
        <header className="branch-list-header">
          <div>
            <h1 className="branch-list-title">Danh sách chi nhánh</h1>
            <p className="branch-list-breadcrumb" aria-label="Breadcrumb">
              Quản lý chi nhánh <span aria-hidden="true">›</span> Danh sách chi nhánh
            </p>
          </div>
        </header>

        <section className="branch-filter-panel" aria-label="Bộ lọc chi nhánh">
          <form className="branch-list-toolbar" onSubmit={handleSearch}>
            <label className="branch-list-field branch-list-search-field">
              <span>Tìm kiếm chi nhánh</span>
              <div className="input-with-icon">
                <Search size={16} aria-hidden="true" />
                <input
                  className="input"
                  maxLength={100}
                  value={searchInput}
                  placeholder="Tìm theo tên chi nhánh..."
                  onChange={(event) => setSearchInput(event.target.value)}
                />
              </div>
            </label>

            <label className="branch-list-field">
              <span>Trạng thái</span>
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

            <button className="btn btn-primary branch-list-search-button" type="submit">
              Tìm kiếm
            </button>

            <button
              className="btn btn-outline"
              type="button"
              onClick={handleReset}
            >
              Đặt lại bộ lọc
            </button>

            <Link className="btn btn-primary branch-list-add-button" to="/branches/new">
              <Plus size={16} aria-hidden="true" />
              Thêm chi nhánh
            </Link>
          </form>
        </section>

        <section className="branch-list-table-panel" aria-labelledby="branch-list-title">
          <h2 className="sr-only" id="branch-list-title">Danh sách chi nhánh</h2>
          {branchesQuery.isLoading ? (
            <div className="empty-state">Đang tải danh sách chi nhánh...</div>
          ) : branchesQuery.isError ? (
            <div className="branch-list-panel-body">
              <div className="error-state" role="alert">
                {getApiErrorMessage(branchesQuery.error)}
              </div>
            </div>
          ) : pageRows.length === 0 ? (
            <div className="empty-state">Không tìm thấy chi nhánh phù hợp.</div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table branch-list-table">
                  <thead>
                    <tr>
                      <th>Tên chi nhánh</th>
                      <th>Địa chỉ</th>
                      <th>Quản lý</th>
                      <th>Số điện thoại</th>
                      <th>Trạng thái</th>
                      <th className="branch-list-actions-heading">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((branch) => (
                      <tr key={branch.id}>
                        <td className="branch-list-name">
                          <strong>{branch.name}</strong>
                        </td>
                        <td className="branch-list-address">{branch.address}</td>
                        <td>{getManagerName(branch, managersById)}</td>
                        <td className="mono">{branch.phone}</td>
                        <td>
                          <span className={`branch-status-pill ${branch.status === 'ACTIVE' ? 'is-active' : 'is-inactive'}`}>
                            {branch.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                          </span>
                        </td>
                        <td className="branch-list-actions-cell">
                          <div className="table-actions branch-list-actions">
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
                              <UserRoundPlus size={16} aria-hidden="true" />
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
                              <Power size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination branch-list-pagination">
                <span className="branch-list-pagination-summary">
                  Hiển thị {firstItem}–{lastItem} trong tổng số {filteredBranches.length} chi nhánh
                </span>
                <div className="pagination-actions">
                  <button
                    className="btn btn-outline branch-page-button"
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => setPage(1)}
                  >
                    Đầu
                  </button>
                  <button
                    className="btn btn-outline btn-icon branch-page-button"
                    type="button"
                    aria-label="Trang trước"
                    disabled={safePage === 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                  </button>
                  {visiblePages.map((pageNumber) => (
                    <button
                      className={`btn btn-outline btn-icon branch-page-button ${pageNumber === safePage ? 'is-current' : ''}`}
                      key={pageNumber}
                      type="button"
                      aria-current={pageNumber === safePage ? 'page' : undefined}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    className="btn btn-outline btn-icon branch-page-button"
                    type="button"
                    aria-label="Trang sau"
                    disabled={safePage === totalPages}
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                  <button
                    className="btn btn-outline branch-page-button"
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => setPage(totalPages)}
                  >
                    Cuối
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
