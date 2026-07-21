import { useState, useEffect } from 'react'
import {
  BarChart2,
  Bell,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  Pill,
  ShoppingCart,
  Truck,
  User,
  Users,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../modules/user-service/api/authApi'

export function DashboardLayout({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userStr = localStorage.getItem('pcms_user')
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch (e) {
        // Ignore
      }
    }
  }, [])

  async function handleLogout() {
    try {
      const refreshToken = localStorage.getItem('pcms_refresh_token')
      if (refreshToken) {
        await logout(refreshToken)
      }
    } catch (e) {
      // Ignore API errors on logout
    } finally {
      localStorage.removeItem('pcms_access_token')
      localStorage.removeItem('pcms_refresh_token')
      localStorage.removeItem('pcms_user')
      navigate('/login')
    }
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Điều hướng chính" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="app-brand">
          <span className="app-brand-mark">P</span>
          <span className="app-brand-text">
            <span className="app-brand-title">PCMS</span>
            <span className="app-brand-subtitle">Pharmacy Console</span>
          </span>
        </div>

        <nav className="app-nav" style={{ flex: 1 }}>
          <NavLink className="app-nav-link" to="/branches">
            <Building2 size={16} aria-hidden="true" />
            Chi nhánh
          </NavLink>
          <NavLink className="app-nav-link" to="/customers">
            <Users size={16} aria-hidden="true" />
            Khách hàng
          </NavLink>
          <NavLink className="app-nav-link" to="/medicines">
            <Pill size={16} aria-hidden="true" />
            Thuốc
          </NavLink>
          <NavLink className="app-nav-link" to="/inventory">
            <PackageCheck size={16} aria-hidden="true" />
            Tồn kho
          </NavLink>
          <NavLink className="app-nav-link" to="/orders">
            <ShoppingCart size={16} aria-hidden="true" />
            Đơn hàng
          </NavLink>
          <NavLink className="app-nav-link" to="/payments">
            <CreditCard size={16} aria-hidden="true" />
            Giao dịch
          </NavLink>
          <NavLink className="app-nav-link" to="/dashboard/suppliers">
            <Truck size={16} aria-hidden="true" />
            Nhà cung cấp
          </NavLink>
          <NavLink className="app-nav-link" to="/dashboard/prescriptions">
            <FileText size={16} aria-hidden="true" />
            Đơn thuốc
          </NavLink>
          <NavLink className="app-nav-link" to="/dashboard/notifications">
            <Bell size={16} aria-hidden="true" />
            Thông báo
          </NavLink>
          <NavLink className="app-nav-link" to="/dashboard/reports">
            <BarChart2 size={16} aria-hidden="true" />
            Báo cáo
          </NavLink>
          {user && (user.role === 'ADMIN' || user.role === 'CEO') ? (
            <NavLink className="app-nav-link" to="/user-dashboard">
              <LayoutDashboard size={16} aria-hidden="true" />
              Tổng quan
            </NavLink>
          ) : (
            <span className="app-nav-link" aria-disabled="true">
              <LayoutDashboard size={16} aria-hidden="true" />
              Tổng quan
            </span>
          )}

          {user && (user.role === 'ADMIN' || user.role === 'CEO') && (
            <>
              <NavLink className="app-nav-link" to="/users">
                <User size={16} aria-hidden="true" />
                Người dùng
              </NavLink>
              <NavLink className="app-nav-link" to="/audit-logs">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m16 13-3.5 3.5-2-2"></path></svg>
                Nhật ký
              </NavLink>
            </>
          )}
        </nav>

        {user && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--ink-200)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <NavLink
                to={`/users/${user.id}`}
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--ink-900)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.fullName}
              </NavLink>
              <div style={{ fontSize: '13px', color: 'var(--ink-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.role}
              </div>
            </div>
            <button
              className="btn btn-ghost btn-icon"
              onClick={handleLogout}
              title="Đăng xuất"
              style={{ color: 'var(--ink-500)', flexShrink: 0 }}
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </aside>

      <main className="app-main">{children}</main>
    </div>
  )
}
