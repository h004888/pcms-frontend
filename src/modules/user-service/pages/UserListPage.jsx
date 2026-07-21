import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Download,
  Eye,
  Lock,
  LockOpen,
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
  const [lockUserTarget, setLockUserTarget] = useState(null)
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

  const lockMutation = useMutation({
    mutationFn: () => changeUserStatus(lockUserTarget.id, 'INACTIVE'),
    onSuccess: () => {
      toast.success('Đã khóa tài khoản thành công.')
      setLockUserTarget(null)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const unlockMutation = useMutation({
    mutationFn: () => changeUserStatus(unlockUserTarget.id, 'ACTIVE'),
    onSuccess: () => {
      toast.success('Đã kích hoạt tài khoản thành công.')
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--ink-900)' }}>
            Bảng điều khiển quản lý người dùng
          </h1>
          <Link className="btn btn-primary" to="/users/new">
            Thêm người dùng
          </Link>
        </div>

        <section className="card" aria-labelledby="user-list-title">
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
                      <th>Họ và tên</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                      <th>Chi nhánh</th>
                      <th style={{ width: '220px' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map(user => (
                      <tr key={user.id}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td><RoleBadge role={user.role} /></td>
                        <td>
                          {user.branchId && branchesById.has(user.branchId)
                            ? branchesById.get(user.branchId).name
                            : '—'}
                        </td>
                        <td>
                          <div className="table-actions" style={{ justifyContent: 'flex-start', gap: '8px' }}>
                            <Link
                              className="btn btn-outline"
                              style={{ padding: '4px 8px', fontSize: '13px', minHeight: 'auto' }}
                              to={`/users/${user.id}`}
                            >
                              Xem
                            </Link>
                            <Link
                              className="btn btn-outline"
                              style={{ padding: '4px 8px', fontSize: '13px', minHeight: 'auto' }}
                              to={`/users/${user.id}/edit`}
                            >
                              Sửa
                            </Link>
                            {user.status === 'INACTIVE' ? (
                              <button
                                className="btn btn-outline"
                                style={{ padding: '4px 8px', fontSize: '13px', minHeight: 'auto', color: 'var(--success-700)', borderColor: 'var(--ink-200)' }}
                                onClick={() => setUnlockUserTarget(user)}
                              >
                                Kích hoạt
                              </button>
                            ) : (
                              <button
                                className="btn btn-outline"
                                style={{ padding: '4px 8px', fontSize: '13px', minHeight: 'auto', color: 'var(--danger-700)', borderColor: 'var(--ink-200)' }}
                                onClick={() => setDeleteUserTarget(user)}
                              >
                                Xóa
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination" style={{ padding: '16px 20px', borderTop: '1px solid var(--ink-200)' }}>
                <span style={{ fontSize: '14px', color: 'var(--ink-500)' }}>
                  Hiển thị từ {filteredUsers.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} đến {Math.min(safePage * PAGE_SIZE, filteredUsers.length)} của {filteredUsers.length} bản ghi
                </span>
                <div className="pagination-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    className="btn btn-ghost"
                    type="button"
                    style={{ fontSize: '14px', padding: '4px 8px' }}
                    disabled={safePage === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    &lt; Trước
                  </button>

                  <button
                    className="btn btn-outline"
                    type="button"
                    style={{ pointerEvents: 'none', minWidth: '40px', padding: '4px 0', fontSize: '14px', minHeight: 'auto' }}
                  >
                    {safePage}
                  </button>

                  <button
                    className="btn btn-ghost"
                    type="button"
                    style={{ fontSize: '14px', padding: '4px 8px' }}
                    disabled={safePage === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  >
                    Sau &gt;
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
        branches={branches.filter((branch) => branch.status === 'ACTIVE')}
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
