import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Download,
  Eye,
  Lock,
  Pencil,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Building2,
  UserCog,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listBranches } from '../../branch-service/api/branchApi.js'
import {
  assignBranch,
  changeUserRole,
  changeUserStatus,
  deleteUser,
  exportUsers,
  listUsers,
  unlockUser,
} from '../api/userApi.js'
import { AssignBranchDialog } from '../components/AssignBranchDialog.jsx'
import { ChangeRoleDialog } from '../components/ChangeRoleDialog.jsx'
import { ChangeStatusDialog } from '../components/ChangeStatusDialog.jsx'
import { DeleteUserDialog } from '../components/DeleteUserDialog.jsx'
import { RoleBadge } from '../components/RoleBadge.jsx'
import { UnlockUserDialog } from '../components/UnlockUserDialog.jsx'
import { UserStatusBadge } from '../components/UserStatusBadge.jsx'
import {
  ROLE_OPTIONS,
  STATUS_OPTIONS,
  formatDateTime,
  normalizeSearch,
} from '../services/userFormatters.js'

const PAGE_SIZE = 10

export function UserListPage() {
  const queryClient = useQueryClient()
  
  // Filters
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)

  // Dialog state
  const [roleUser, setRoleUser] = useState(null)
  const [statusUser, setStatusUser] = useState(null)
  const [branchUser, setBranchUser] = useState(null)
  const [unlockUserTarget, setUnlockUserTarget] = useState(null)
  const [deleteUserTarget, setDeleteUserTarget] = useState(null)

  // Queries
  const usersQuery = useQuery({
    queryKey: ['users', appliedSearch, roleFilter, statusFilter],
    queryFn: () => {
      const params = { page: 0, size: 500 }
      if (appliedSearch) params.search = appliedSearch
      if (roleFilter !== 'ALL') params.role = roleFilter
      if (statusFilter !== 'ALL') params.status = statusFilter
      return listUsers(params)
    },
  })

  const branchesQuery = useQuery({
    queryKey: ['branches'],
    queryFn: () => listBranches({ page: 0, size: 500 }),
  })
  
  const branches = useMemo(() => branchesQuery.data?.data || [], [branchesQuery.data?.data])
  const branchesById = useMemo(() => new Map(branches.map(b => [b.id, b])), [branches])

  // Mutations
  const roleMutation = useMutation({
    mutationFn: (newRole) => changeUserRole(roleUser.id, newRole),
    onSuccess: () => {
      toast.success('Đã cập nhật vai trò người dùng.')
      setRoleUser(null)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const statusMutation = useMutation({
    mutationFn: (newStatus) => changeUserStatus(statusUser.id, newStatus),
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái người dùng.')
      setStatusUser(null)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const assignBranchMutation = useMutation({
    mutationFn: (branchId) => assignBranch(branchUser.id, branchId),
    onSuccess: () => {
      toast.success('Đã cập nhật chi nhánh người dùng.')
      setBranchUser(null)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const unlockMutation = useMutation({
    mutationFn: () => unlockUser(unlockUserTarget.id),
    onSuccess: () => {
      toast.success('Đã mở khóa tài khoản thành công.')
      setUnlockUserTarget(null)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(deleteUserTarget.id),
    onSuccess: () => {
      toast.success('Đã xóa người dùng.')
      setDeleteUserTarget(null)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  // Local filtering & pagination based on the 500 loaded items
  // Since search params are sent to backend, local filtering is mostly for robustness
  const users = useMemo(() => usersQuery.data?.data || [], [usersQuery.data?.data])
  
  const filteredUsers = useMemo(() => {
    const keyword = normalizeSearch(appliedSearch)
    return users.filter(user => {
      const matchSearch = !keyword || 
        [user.email, user.fullName, user.phone]
          .filter(Boolean)
          .some(v => normalizeSearch(String(v)).includes(keyword))
      
      const matchRole = roleFilter === 'ALL' || user.role === roleFilter
      const matchStatus = statusFilter === 'ALL' || user.status === statusFilter
      
      return matchSearch && matchRole && matchStatus
    })
  }, [users, appliedSearch, roleFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filteredUsers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleSearch(event) {
    event.preventDefault()
    setAppliedSearch(searchInput)
    setPage(1)
  }

  function handleReset() {
    setSearchInput('')
    setAppliedSearch('')
    setRoleFilter('ALL')
    setStatusFilter('ALL')
    setPage(1)
  }

  async function handleExport() {
    try {
      const params = {}
      if (appliedSearch) params.search = appliedSearch
      if (roleFilter !== 'ALL') params.role = roleFilter
      if (statusFilter !== 'ALL') params.status = statusFilter
      
      const blob = await exportUsers(params)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'users.csv')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (error) {
      toast.error('Không thể xuất file CSV')
    }
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">Quản lý người dùng</h1>
            <p className="page-description">
              Quản lý tài khoản nhân viên và khách hàng, phân quyền, gắn chi nhánh
              và theo dõi trạng thái hoạt động.
            </p>
          </div>

          <Link className="btn btn-primary" to="/users/new">
            <Plus size={16} aria-hidden="true" />
            Tạo người dùng
          </Link>
        </header>

        <section className="card" aria-labelledby="user-filter-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="user-filter-title">Bộ lọc</h2>
              <p className="card-subtitle">Tìm kiếm theo tên, email, sđt và lọc theo trạng thái/vai trò.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline" type="button" onClick={handleExport}>
                <Download size={16} aria-hidden="true" />
                Xuất CSV
              </button>
              <button className="btn btn-outline" type="button" onClick={handleReset}>
                <RotateCcw size={16} aria-hidden="true" />
                Đặt lại
              </button>
            </div>
          </div>

          <form className="card-body toolbar user-toolbar" onSubmit={handleSearch}>
            <label className="field">
              <span className="field-label">Tìm người dùng</span>
              <input
                className="input"
                maxLength={100}
                value={searchInput}
                placeholder="Tên, email, số điện thoại..."
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </label>

            <label className="field">
              <span className="field-label">Vai trò</span>
              <select
                className="select"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="ALL">Tất cả vai trò</option>
                {ROLE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field-label">Trạng thái</span>
              <select
                className="select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="ALL">Tất cả trạng thái</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>

            <button className="btn btn-primary" type="submit">
              <Search size={16} aria-hidden="true" />
              Tìm kiếm
            </button>

            <button
              className="btn btn-outline"
              type="button"
              onClick={() => usersQuery.refetch()}
            >
              <RefreshCcw size={16} aria-hidden="true" />
              Tải lại
            </button>
          </form>
        </section>

        <section className="card" aria-labelledby="user-list-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="user-list-title">Danh sách người dùng</h2>
              <p className="card-subtitle">{filteredUsers.length} tài khoản phù hợp.</p>
            </div>
          </div>

          {usersQuery.isLoading ? (
            <div className="empty-state">Đang tải danh sách người dùng...</div>
          ) : usersQuery.isError ? (
            <div className="card-body">
              <div className="error-state" role="alert">
                {getApiErrorMessage(usersQuery.error)}
              </div>
            </div>
          ) : pageRows.length === 0 ? (
            <div className="empty-state">Không tìm thấy người dùng.</div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Email / Họ tên</th>
                      <th>Số điện thoại</th>
                      <th>Vai trò</th>
                      <th>Chi nhánh</th>
                      <th>Trạng thái</th>
                      <th>Đăng nhập cuối</th>
                      <th aria-label="Thao tác" />
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div><strong>{user.fullName}</strong></div>
                          <div style={{ color: 'var(--ink-500)', fontSize: '13px' }}>{user.email}</div>
                        </td>
                        <td className="mono">{user.phone || '—'}</td>
                        <td><RoleBadge role={user.role} /></td>
                        <td>
                          {user.branchId && branchesById.has(user.branchId) 
                            ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Building2 size={14} color="var(--ink-400)" />
                                {branchesById.get(user.branchId).name}
                              </span>
                            : <span style={{ color: 'var(--ink-400)' }}>— (Toàn hệ thống)</span>
                          }
                        </td>
                        <td><UserStatusBadge status={user.status} /></td>
                        <td>{formatDateTime(user.lastLoginAt)}</td>
                        <td>
                          <div className="table-actions">
                            <Link
                              className="btn btn-outline btn-icon"
                              to={`/users/${user.id}`}
                              title="Xem chi tiết"
                            >
                              <Eye size={16} aria-hidden="true" />
                            </Link>
                            <Link
                              className="btn btn-outline btn-icon"
                              to={`/users/${user.id}/edit`}
                              title="Sửa thông tin cơ bản"
                            >
                              <Pencil size={16} aria-hidden="true" />
                            </Link>
                            <button
                              className="btn btn-outline btn-icon"
                              title="Đổi vai trò"
                              onClick={() => setRoleUser(user)}
                            >
                              <UserCog size={16} aria-hidden="true" />
                            </button>
                            <button
                              className="btn btn-outline btn-icon"
                              title="Gán chi nhánh"
                              disabled={user.role === 'CUSTOMER'}
                              onClick={() => setBranchUser(user)}
                            >
                              <Building2 size={16} aria-hidden="true" />
                            </button>
                            {user.status === 'LOCKED' ? (
                              <button
                                className="btn btn-outline btn-icon"
                                title="Mở khóa tài khoản"
                                onClick={() => setUnlockUserTarget(user)}
                              >
                                <Lock size={16} aria-hidden="true" />
                              </button>
                            ) : (
                              <button
                                className="btn btn-outline btn-icon"
                                title="Đổi trạng thái"
                                onClick={() => setStatusUser(user)}
                              >
                                <ShieldAlert size={16} aria-hidden="true" />
                              </button>
                            )}
                            <button
                              className="btn btn-outline btn-icon"
                              style={{ color: 'var(--danger-700)', borderColor: 'var(--ink-200)' }}
                              title="Xóa người dùng"
                              onClick={() => setDeleteUserTarget(user)}
                            >
                              <Trash2 size={16} aria-hidden="true" />
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
                <div className="pagination-actions" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    Trước
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) acc.push('...')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((p, i) => p === '...' ? (
                      <span key={`dots-${i}`} style={{ padding: '0 8px', color: 'var(--ink-500)' }}>...</span>
                    ) : (
                      <button
                        key={p}
                        className={p === safePage ? "btn btn-primary" : "btn btn-outline"}
                        style={p === safePage ? {} : { borderColor: 'var(--ink-200)', color: 'var(--ink-700)' }}
                        type="button"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))
                  }

                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  >
                    Sau
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <ChangeRoleDialog
        user={roleUser}
        isPending={roleMutation.isPending}
        onClose={() => setRoleUser(null)}
        onConfirm={(role) => roleMutation.mutate(role)}
      />
      <ChangeStatusDialog
        user={statusUser}
        isPending={statusMutation.isPending}
        onClose={() => setStatusUser(null)}
        onConfirm={(status) => statusMutation.mutate(status)}
      />
      <AssignBranchDialog
        user={branchUser}
        branches={branches}
        isPending={assignBranchMutation.isPending}
        onClose={() => setBranchUser(null)}
        onConfirm={(branchId) => assignBranchMutation.mutate(branchId)}
      />
      <UnlockUserDialog
        user={unlockUserTarget}
        isPending={unlockMutation.isPending}
        onClose={() => setUnlockUserTarget(null)}
        onConfirm={() => unlockMutation.mutate()}
      />
      <DeleteUserDialog
        user={deleteUserTarget}
        isPending={deleteMutation.isPending}
        onClose={() => setDeleteUserTarget(null)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </DashboardLayout>
  )
}
