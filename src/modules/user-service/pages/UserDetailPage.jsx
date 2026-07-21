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
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="card" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', border: '1px solid var(--ink-200)', borderRadius: '8px', overflow: 'hidden' }}>
          
          <div style={{ padding: '24px', borderBottom: '1px solid var(--ink-200)', textAlign: 'center', background: 'var(--surface)' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--ink-900)' }}>
              CHI TIẾT NGƯỜI DÙNG
            </h2>
          </div>

          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '16px' }}>
              <span className="field-label" style={{ margin: 0, color: 'var(--ink-500)', fontSize: '14px' }}>Họ và tên</span>
              <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--ink-900)' }}>{user.fullName}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '16px' }}>
              <span className="field-label" style={{ margin: 0, color: 'var(--ink-500)', fontSize: '14px' }}>Email</span>
              <span style={{ fontSize: '16px', color: 'var(--ink-900)' }}>{user.email}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '16px' }}>
              <span className="field-label" style={{ margin: 0, color: 'var(--ink-500)', fontSize: '14px' }}>Vai trò</span>
              <div><RoleBadge role={user.role} /></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '16px' }}>
              <span className="field-label" style={{ margin: 0, color: 'var(--ink-500)', fontSize: '14px' }}>Chi nhánh</span>
              <span style={{ fontSize: '16px', color: 'var(--ink-900)' }}>{branchName}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px' }}>
              <Link className="btn btn-outline" to="/users" style={{ width: '120px' }}>
                Đóng
              </Link>
              <Link className="btn btn-primary" to={`/users/${userId}/edit`} style={{ width: '150px' }}>
                Sửa người dùng
              </Link>
            </div>

          </div>
        </div>
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
