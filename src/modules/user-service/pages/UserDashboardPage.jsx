import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  AlertTriangle,
  Building2,
  Lock,
  Pill,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { getDashboardStats, getRecentLogins } from '../api/userApi.js'
import { RoleBadge } from '../components/RoleBadge.jsx'
import { UserStatusBadge } from '../components/UserStatusBadge.jsx'
import { formatDateTime } from '../services/userFormatters.js'

export function UserDashboardPage() {
  const statsQuery = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getDashboardStats(),
  })

  const loginsQuery = useQuery({
    queryKey: ['recent-logins'],
    queryFn: () => getRecentLogins({ size: 10 }),
  })

  const stats = statsQuery.data || {}
  const logins = loginsQuery.data?.data || []

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">Tổng quan người dùng</h1>
            <p className="page-description">
              Thống kê số lượng người dùng, trạng thái và hoạt động đăng nhập gần đây.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link className="btn btn-primary" to="/users/new">
              <UserPlus size={16} aria-hidden="true" />
              Thêm người dùng mới
            </Link>
          </div>
        </header>

        {statsQuery.isError ? (
          <div className="alert alert-danger">
            <AlertTriangle size={18} className="alert-icon" />
            <div className="alert-body">
              <strong>Lỗi tải dữ liệu:</strong> {getApiErrorMessage(statsQuery.error)}
            </div>
          </div>
        ) : (
          <>
            <section className="user-stat-grid" aria-labelledby="status-stats">
              <h2 className="sr-only" id="status-stats">Thống kê trạng thái</h2>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--ink-500)', fontSize: '14px', fontWeight: 500 }}>Tổng người dùng</span>
                  <Users size={20} color="var(--ink-400)" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ink-900)' }}>
                  {statsQuery.isLoading ? '...' : (stats.totalUsers || 0)}
                </div>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--ink-500)', fontSize: '14px', fontWeight: 500 }}>Đang hoạt động</span>
                  <UserCheck size={20} color="var(--accent-500)" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ink-900)' }}>
                  {statsQuery.isLoading ? '...' : (stats.activeUsers || 0)}
                </div>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--ink-500)', fontSize: '14px', fontWeight: 500 }}>Tài khoản khóa</span>
                  <Lock size={20} color="var(--danger-500)" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ink-900)' }}>
                  {statsQuery.isLoading ? '...' : (stats.lockedUsers || 0)}
                </div>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--ink-500)', fontSize: '14px', fontWeight: 500 }}>Ngưng hoạt động</span>
                  <Activity size={20} color="var(--ink-300)" />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ink-900)' }}>
                  {statsQuery.isLoading ? '...' : (stats.inactiveUsers || 0)}
                </div>
              </div>
            </section>

            <section className="user-action-grid" aria-labelledby="role-stats">
              <h2 className="sr-only" id="role-stats">Thống kê theo vai trò</h2>
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--info-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} color="var(--info-600)" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Quản trị viên</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-500)' }}>Admin & CEO</p>
                  </div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '12px' }}>
                  {statsQuery.isLoading ? '...' : (stats.administrators || 0)}
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={20} color="var(--accent-600)" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Quản lý chi nhánh</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-500)' }}>Branch Managers</p>
                  </div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '12px' }}>
                  {statsQuery.isLoading ? '...' : (stats.branchManagers || 0)}
                </div>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Pill size={20} color="var(--teal-600)" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Dược sĩ</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-500)' }}>Pharmacists</p>
                  </div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '12px' }}>
                  {statsQuery.isLoading ? '...' : (stats.pharmacists || 0)}
                </div>
              </div>
            </section>
          </>
        )}

        <section className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Đăng nhập gần đây</h2>
              <p className="card-subtitle">10 lượt đăng nhập gần nhất vào hệ thống.</p>
            </div>
            <Link className="btn btn-outline" to="/audit-logs">
              Xem nhật ký truy cập
            </Link>
          </div>

          {loginsQuery.isLoading ? (
            <div className="empty-state">Đang tải dữ liệu đăng nhập...</div>
          ) : logins.length === 0 ? (
            <div className="empty-state">Chưa có lượt đăng nhập nào được ghi nhận.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Tài khoản ID (Target)</th>
                    <th>IP Address</th>
                    <th>Mô tả</th>
                  </tr>
                </thead>
                <tbody>
                  {logins.map(log => (
                    <tr key={log.id}>
                      <td>{formatDateTime(log.createdAt)}</td>
                      <td className="mono">{log.targetId || log.userId}</td>
                      <td className="mono">{log.ipAddress || '—'}</td>
                      <td>{log.description}</td>
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
