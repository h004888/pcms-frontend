import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  CalendarClock,
  Edit,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Users,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { StatusBadge } from '@shared/ui/StatusBadge.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import {
  assignBranchManager,
  deactivateBranch,
  getBranch,
  getBranchStaff,
  getUser,
  listBranchManagers,
  updateBranch,
} from '../api/branchApi.js'
import { AssignManagerDialog } from '../components/AssignManagerDialog.jsx'
import { BranchStatusDialog } from '../components/BranchStatusDialog.jsx'
import {
  formatDateTime,
  getManagerName,
  shortId,
} from '../services/branchFormatters.js'

export function BranchDetailPage() {
  const { branchId } = useParams()
  const queryClient = useQueryClient()
  const [managerDialogOpen, setManagerDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)

  const branchQuery = useQuery({
    queryKey: ['branches', branchId],
    queryFn: () => getBranch(branchId),
  })
  const staffQuery = useQuery({
    queryKey: ['branches', branchId, 'staff'],
    queryFn: () => getBranchStaff(branchId),
    enabled: Boolean(branchId),
  })
  const managersQuery = useQuery({
    queryKey: ['branch-managers'],
    queryFn: () => listBranchManagers({ page: 0, size: 100 }),
  })
  const managerQuery = useQuery({
    queryKey: ['users', branchQuery.data?.managerId],
    queryFn: () => getUser(branchQuery.data.managerId),
    enabled: Boolean(branchQuery.data?.managerId),
  })
  const managers = useMemo(
    () => managersQuery.data?.data || [],
    [managersQuery.data?.data],
  )
  const managersById = useMemo(
    () => new Map(managers.map((manager) => [manager.id, manager])),
    [managers],
  )
  const branch = branchQuery.data

  const assignMutation = useMutation({
    mutationFn: (managerId) => assignBranchManager(branch.id, managerId),
    onSuccess: () => {
      toast.success('Đã gán quản lý chi nhánh.')
      setManagerDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      queryClient.invalidateQueries({ queryKey: ['branches', branchId] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const statusMutation = useMutation({
    mutationFn: ({ branch: selectedBranch }) =>
      selectedBranch.status === 'ACTIVE'
        ? deactivateBranch(selectedBranch.id)
        : updateBranch(selectedBranch.id, { status: 'ACTIVE' }),
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái chi nhánh.')
      setStatusDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      queryClient.invalidateQueries({ queryKey: ['branches', branchId] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  if (branchQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="empty-state">Đang tải chi tiết chi nhánh...</div>
      </DashboardLayout>
    )
  }

  if (branchQuery.isError) {
    return (
      <DashboardLayout>
        <div className="error-state" role="alert">
          {getApiErrorMessage(branchQuery.error)}
        </div>
      </DashboardLayout>
    )
  }

  const managerName =
    managerQuery.data?.fullName || getManagerName(branch, managersById)
  const staffCount = staffQuery.data?.length ?? 0

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">{branch.name}</h1>
            <p className="page-description">
              <span className="mono">{branch.code}</span> · {branch.address}
            </p>
          </div>

          <div className="table-actions">
            <Link className="btn btn-outline" to="/branches">
              <ArrowLeft size={16} aria-hidden="true" />
              Danh sách
            </Link>
            <Link className="btn btn-primary" to={`/branches/${branch.id}/edit`}>
              <Edit size={16} aria-hidden="true" />
              Chỉnh sửa
            </Link>
          </div>
        </header>

        <div className="detail-grid">
          <section className="card" aria-labelledby="branch-detail-title">
            <div className="card-header">
              <div>
                <h2 className="card-title" id="branch-detail-title">
                  Thông tin chi nhánh
                </h2>
                <p className="card-subtitle">
                  Thông tin vận hành và phân công quản lý hiện tại.
                </p>
              </div>
              <StatusBadge status={branch.status} />
            </div>

            <div className="card-body detail-list">
              <div className="detail-item">
                <span className="detail-label">Mã chi nhánh</span>
                <span className="detail-value mono">{branch.code}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Số điện thoại</span>
                <span className="detail-value mono">{branch.phone}</span>
              </div>
              <div className="detail-item form-grid-full">
                <span className="detail-label">Địa chỉ</span>
                <span className="detail-value">{branch.address}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Quản lý</span>
                <span className="detail-value">{managerName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ID quản lý</span>
                <span className="detail-value mono">
                  {branch.managerId ? shortId(branch.managerId) : '--'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Ngày tạo</span>
                <span className="detail-value">{formatDateTime(branch.createdAt)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cập nhật gần nhất</span>
                <span className="detail-value">{formatDateTime(branch.updatedAt)}</span>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-outline"
                type="button"
                disabled={branch.status !== 'ACTIVE'}
                onClick={() => setManagerDialogOpen(true)}
              >
                <ShieldCheck size={16} aria-hidden="true" />
                Gán quản lý
              </button>
              <button
                className={
                  branch.status === 'ACTIVE'
                    ? 'btn btn-danger'
                    : 'btn btn-primary'
                }
                type="button"
                onClick={() => setStatusDialogOpen(true)}
              >
                {branch.status === 'ACTIVE' ? (
                  <ToggleRight size={16} aria-hidden="true" />
                ) : (
                  <ToggleLeft size={16} aria-hidden="true" />
                )}
                {branch.status === 'ACTIVE' ? 'Ngưng hoạt động' : 'Kích hoạt'}
              </button>
            </div>
          </section>

          <aside className="stat-grid" aria-label="Tổng quan chi nhánh">
            <div className="stat-card">
              <div>
                <p className="stat-title">Nhân sự thuộc chi nhánh</p>
                <p className="stat-value mono">{staffCount}</p>
              </div>
              <Users color="var(--accent-700)" size={22} aria-hidden="true" />
            </div>
            <div className="stat-card">
              <div>
                <p className="stat-title">Trạng thái</p>
                <p className="stat-value">
                  {branch.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                </p>
              </div>
              {branch.status === 'ACTIVE' ? (
                <ToggleRight color="var(--accent-700)" size={22} aria-hidden="true" />
              ) : (
                <ToggleLeft color="var(--ink-500)" size={22} aria-hidden="true" />
              )}
            </div>
            <div className="stat-card">
              <div>
                <p className="stat-title">Ngày tạo</p>
                <p className="stat-value" style={{ fontSize: 18 }}>
                  {formatDateTime(branch.createdAt).split(' ')[0]}
                </p>
              </div>
              <CalendarClock
                color="var(--ink-500)"
                size={22}
                aria-hidden="true"
              />
            </div>
          </aside>
        </div>

        <section className="card" aria-labelledby="staff-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="staff-title">
                Nhân sự chi nhánh
              </h2>
              <p className="card-subtitle">Thông tin được cập nhật theo dữ liệu hiện có.</p>
            </div>
          </div>

          {staffQuery.isLoading ? (
            <div className="empty-state">Đang tải nhân sự...</div>
          ) : staffQuery.isError ? (
            <div className="card-body">
              <div className="error-state" role="alert">
                {getApiErrorMessage(staffQuery.error)}
              </div>
            </div>
          ) : staffQuery.data?.length ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {staffQuery.data.map((staff) => (
                    <tr key={staff.id}>
                      <td>{staff.fullName}</td>
                      <td>{staff.email}</td>
                      <td className="mono">{staff.phone || '--'}</td>
                      <td>{staff.role}</td>
                      <td>
                        <StatusBadge status={staff.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">Chi nhánh chưa có nhân sự.</div>
          )}
        </section>
      </div>

      <AssignManagerDialog
        branch={managerDialogOpen ? branch : null}
        managers={managers}
        isPending={assignMutation.isPending}
        onClose={() => setManagerDialogOpen(false)}
        onConfirm={(managerId) => assignMutation.mutate(managerId)}
      />
      <BranchStatusDialog
        branch={statusDialogOpen ? branch : null}
        isPending={statusMutation.isPending}
        onClose={() => setStatusDialogOpen(false)}
        onConfirm={(payload) => statusMutation.mutate(payload)}
      />
    </DashboardLayout>
  )
}
