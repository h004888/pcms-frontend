import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Edit, Lock, Trash2, Building2, UserCog, ShieldAlert, KeyRound } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listBranches } from '../../branch-service/api/branchApi.js'
import { 
  assignBranch, 
  changeUserRole, 
  changeUserStatus, 
  deleteUser, 
  getUser, 
  unlockUser 
} from '../api/userApi.js'
import { AssignBranchDialog } from '../components/AssignBranchDialog.jsx'
import { ChangeRoleDialog } from '../components/ChangeRoleDialog.jsx'
import { ChangeStatusDialog } from '../components/ChangeStatusDialog.jsx'
import { DeleteUserDialog } from '../components/DeleteUserDialog.jsx'
import { RoleBadge } from '../components/RoleBadge.jsx'
import { UnlockUserDialog } from '../components/UnlockUserDialog.jsx'
import { UserStatusBadge } from '../components/UserStatusBadge.jsx'
import { formatDateTime } from '../services/userFormatters.js'

export function UserDetailPage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Dialog state
  const [roleUser, setRoleUser] = useState(null)
  const [statusUser, setStatusUser] = useState(null)
  const [branchUser, setBranchUser] = useState(null)
  const [unlockUserTarget, setUnlockUserTarget] = useState(null)
  const [deleteUserTarget, setDeleteUserTarget] = useState(null)

  // Queries
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  })
  
  const branchesQuery = useQuery({
    queryKey: ['branches'],
    queryFn: () => listBranches({ page: 0, size: 500 }),
  })
  
  const user = userQuery.data
  const branches = useMemo(() => branchesQuery.data?.data || [], [branchesQuery.data?.data])
  const branchesById = useMemo(() => new Map(branches.map(b => [b.id, b])), [branches])
  const branchName = user?.branchId && branchesById.has(user.branchId) 
    ? branchesById.get(user.branchId).name 
    : 'Toàn hệ thống'

  // Mutations
  const roleMutation = useMutation({
    mutationFn: (newRole) => changeUserRole(userId, newRole),
    onSuccess: () => {
      toast.success('Đã cập nhật vai trò người dùng.')
      setRoleUser(null)
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const statusMutation = useMutation({
    mutationFn: (newStatus) => changeUserStatus(userId, newStatus),
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái người dùng.')
      setStatusUser(null)
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const assignBranchMutation = useMutation({
    mutationFn: (branchId) => assignBranch(userId, branchId),
    onSuccess: () => {
      toast.success('Đã cập nhật chi nhánh người dùng.')
      setBranchUser(null)
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const unlockMutation = useMutation({
    mutationFn: () => unlockUser(userId),
    onSuccess: () => {
      toast.success('Đã mở khóa tài khoản thành công.')
      setUnlockUserTarget(null)
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: () => {
      toast.success('Đã xóa người dùng.')
      setDeleteUserTarget(null)
      navigate('/users')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  if (userQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="empty-state">Đang tải thông tin người dùng...</div>
      </DashboardLayout>
    )
  }

  if (userQuery.isError || !user) {
    return (
      <DashboardLayout>
        <div className="empty-state">
          {getApiErrorMessage(userQuery.error) || 'Không tìm thấy người dùng'}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <p className="page-kicker">
              <Link to="/users" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ArrowLeft size={14} /> Danh sách người dùng
              </Link>
            </p>
            <h1 className="page-title">{user.fullName}</h1>
            <p className="page-description">
              Chi tiết người dùng. Bạn có thể thay đổi vai trò, phân công chi nhánh hoặc cập nhật trạng thái hoạt động tại đây.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link className="btn btn-primary" to={`/users/${userId}/edit`}>
              <Edit size={16} aria-hidden="true" />
              Chỉnh sửa thông tin
            </Link>
          </div>
        </header>

        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Hồ sơ người dùng</h2>
          </div>
          <div className="card-body detail-grid">
            
            {/* Left Col: Info List */}
            <div className="detail-list">
              <div className="detail-item">
                <span className="detail-label">MÃ NGƯỜI DÙNG (ID)</span>
                <span className="detail-value mono">{user.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">TRẠNG THÁI</span>
                <div className="detail-value"><UserStatusBadge status={user.status} /></div>
              </div>

              <div className="detail-item">
                <span className="detail-label">HỌ VÀ TÊN</span>
                <span className="detail-value">{user.fullName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">VAI TRÒ</span>
                <div className="detail-value"><RoleBadge role={user.role} /></div>
              </div>

              <div className="detail-item">
                <span className="detail-label">EMAIL ĐĂNG NHẬP</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">CHI NHÁNH PHÂN CÔNG</span>
                <span className="detail-value" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={16} color="var(--ink-400)" />
                  {branchName}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">SỐ ĐIỆN THOẠI</span>
                <span className="detail-value mono">{user.phone || '—'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ĐĂNG NHẬP CUỐI</span>
                <span className="detail-value">{formatDateTime(user.lastLoginAt)}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">NGÀY TẠO</span>
                <span className="detail-value">{formatDateTime(user.createdAt)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">CẬP NHẬT LẦN CUỐI</span>
                <span className="detail-value">{formatDateTime(user.updatedAt)}</span>
              </div>
            </div>

            {/* Right Col: Quick Actions */}
            <div className="user-action-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <button 
                className="quick-action" 
                onClick={() => setRoleUser(user)}
              >
                <UserCog size={24} color="var(--ink-600)" />
                Đổi vai trò
              </button>
              <button 
                className="quick-action" 
                disabled={user.role === 'CUSTOMER'}
                onClick={() => setBranchUser(user)}
              >
                <Building2 size={24} color={user.role === 'CUSTOMER' ? "var(--ink-300)" : "var(--ink-600)"} />
                Gán chi nhánh
              </button>
              
              {user.status === 'LOCKED' ? (
                <button 
                  className="quick-action" 
                  onClick={() => setUnlockUserTarget(user)}
                >
                  <Lock size={24} color="var(--ink-600)" />
                  Mở khóa
                </button>
              ) : (
                <button 
                  className="quick-action" 
                  onClick={() => setStatusUser(user)}
                >
                  <ShieldAlert size={24} color="var(--ink-600)" />
                  Đổi trạng thái
                </button>
              )}
              
              <button 
                className="quick-action" 
                style={{ color: 'var(--danger-700)', borderColor: 'var(--danger-100)' }}
                onClick={() => setDeleteUserTarget(user)}
              >
                <Trash2 size={24} color="var(--danger-700)" />
                Xóa người dùng
              </button>
            </div>
          </div>
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
