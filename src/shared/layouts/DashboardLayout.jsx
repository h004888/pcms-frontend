import { useEffect, useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listNotifications, markNotificationRead } from '../../modules/notification-service/api/notificationApi'
import {
  BarChart2,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  FileText,
  LayoutDashboard,
  List,
  LogOut,
  PackageCheck,
  Pill,
  Plus,
  Settings,
  ShoppingCart,
  Truck,
  User,
  Users,
  UsersRound,
} from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import { logout } from '../../modules/user-service/api/authApi'

export function DashboardLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const isBranchSection = location.pathname.startsWith('/branches')
  const isMedicineSection = location.pathname.startsWith('/medicines')
  const isInventorySection = location.pathname.startsWith('/inventory')
  const [branchMenuOpen, setBranchMenuOpen] = useState(isBranchSection)
  const [medicineMenuOpen, setMedicineMenuOpen] = useState(isMedicineSection)
  const [inventoryMenuOpen, setInventoryMenuOpen] = useState(isInventorySection)
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'CEO'
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)

  const unreadQuery = useQuery({
    queryKey: ['notifications', 'unread', user?.id],
    queryFn: () => listNotifications({ recipientId: user?.id, status: 'unread', size: 5 }),
    enabled: !!user?.id,
    refetchInterval: 15000,
  })
  
  const unreadData = Array.isArray(unreadQuery.data?.content) ? unreadQuery.data.content : (Array.isArray(unreadQuery.data?.data) ? unreadQuery.data.data : [])
  const hasUnread = unreadQuery.data?.totalElements > 0 || unreadData.length > 0

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [notifRef])

  useEffect(() => {
    const userStr = localStorage.getItem('pcms_user')
    if (!userStr) return

    try {
      setUser(JSON.parse(userStr))
    } catch {
      // A malformed local value should not block navigation.
    }
  }, [])

  useEffect(() => {
    if (isBranchSection) setBranchMenuOpen(true)
  }, [isBranchSection])

  useEffect(() => {
    if (isMedicineSection) setMedicineMenuOpen(true)
  }, [isMedicineSection])

  useEffect(() => {
    if (isInventorySection) setInventoryMenuOpen(true)
  }, [isInventorySection])

  async function handleLogout() {
    try {
      const refreshToken = localStorage.getItem('pcms_refresh_token')
      if (refreshToken) await logout(refreshToken)
    } catch {
      // Complete local logout even if the session API is unavailable.
    } finally {
      localStorage.removeItem('pcms_access_token')
      localStorage.removeItem('pcms_refresh_token')
      localStorage.removeItem('pcms_user')
      navigate('/login')
    }
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar is-open" aria-label="Điều hướng chính">
        <div className="app-brand">
          <span className="app-brand-mark">P</span>
          <span className="app-brand-text">
            <span className="app-brand-title">PCMS</span>
            <span className="app-brand-subtitle">Hệ thống quản lý chuỗi nhà thuốc</span>
          </span>
        </div>

        <nav className="app-nav">
          {isAdmin ? (
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

          {isAdmin && (
            <NavLink className="app-nav-link" to="/users">
              <UsersRound size={16} aria-hidden="true" />
              Quản lý người dùng
              <ChevronRight className="app-nav-chevron" size={15} aria-hidden="true" />
            </NavLink>
          )}

          <div className="app-nav-group">
            <button
              className={`app-nav-link app-nav-disclosure ${isBranchSection ? 'is-active' : ''}`}
              type="button"
              aria-expanded={branchMenuOpen}
              aria-controls="branch-navigation"
              onClick={() => setBranchMenuOpen((current) => !current)}
            >
              <Building2 size={16} aria-hidden="true" />
              Quản lý chi nhánh
              {branchMenuOpen ? (
                <ChevronDown className="app-nav-chevron" size={15} aria-hidden="true" />
              ) : (
                <ChevronRight className="app-nav-chevron" size={15} aria-hidden="true" />
              )}
            </button>
            {branchMenuOpen ? (
              <div className="app-nav-children" id="branch-navigation">
                <NavLink className="app-nav-child" end to="/branches">
                  <List size={14} aria-hidden="true" />
                  Danh sách chi nhánh
                </NavLink>
                <NavLink className="app-nav-child" to="/branches/new">
                  <Plus size={14} aria-hidden="true" />
                  Thêm chi nhánh
                </NavLink>
              </div>
            ) : null}
          </div>

          <NavLink className="app-nav-link" to="/customers">
            <Users size={16} aria-hidden="true" />
            Khách hàng
          </NavLink>

          <div className="app-nav-group">
            <button
              className={`app-nav-link app-nav-disclosure ${isMedicineSection ? 'is-active' : ''}`}
              type="button"
              aria-expanded={medicineMenuOpen}
              aria-controls="medicine-navigation"
              onClick={() => setMedicineMenuOpen((current) => !current)}
            >
              <Pill size={16} aria-hidden="true" />
              Quản lý thuốc
              {medicineMenuOpen ? (
                <ChevronDown className="app-nav-chevron" size={15} aria-hidden="true" />
              ) : (
                <ChevronRight className="app-nav-chevron" size={15} aria-hidden="true" />
              )}
            </button>
            {medicineMenuOpen ? (
              <div className="app-nav-children" id="medicine-navigation">
                <NavLink className="app-nav-child" end to="/medicines">
                  <List size={14} aria-hidden="true" />
                  Danh sách thuốc
                </NavLink>
                <NavLink className="app-nav-child" to="/medicines/new">
                  <Plus size={14} aria-hidden="true" />
                  Thêm thuốc
                </NavLink>
              </div>
            ) : null}
          </div>
          <div className="app-nav-group">
            <button
              className={`app-nav-link app-nav-disclosure ${isInventorySection ? 'is-active' : ''}`}
              type="button"
              aria-expanded={inventoryMenuOpen}
              aria-controls="inventory-navigation"
              onClick={() => setInventoryMenuOpen((current) => !current)}
            >
              <PackageCheck size={16} aria-hidden="true" />
              Quản lý kho
              {inventoryMenuOpen ? (
                <ChevronDown className="app-nav-chevron" size={15} aria-hidden="true" />
              ) : (
                <ChevronRight className="app-nav-chevron" size={15} aria-hidden="true" />
              )}
            </button>
            {inventoryMenuOpen ? (
              <div className="app-nav-children" id="inventory-navigation">
                <NavLink className="app-nav-child" end to="/inventory">
                  <LayoutDashboard size={14} aria-hidden="true" />
                  Tổng quan kho
                </NavLink>
                <NavLink className="app-nav-child" to="/inventory/stocks">
                  <List size={14} aria-hidden="true" />
                  Danh sách tồn kho
                </NavLink>
                <NavLink className="app-nav-child" to="/inventory/import">
                  <Plus size={14} aria-hidden="true" />
                  Nhập kho
                </NavLink>
                <NavLink className="app-nav-child" to="/inventory/export">
                  <Plus size={14} aria-hidden="true" />
                  Xuất kho
                </NavLink>
                <NavLink className="app-nav-child" to="/inventory/transfer">
                  <Plus size={14} aria-hidden="true" />
                  Chuyển kho
                </NavLink>
                <NavLink className="app-nav-child" to="/inventory/transfer-approval">
                  <List size={14} aria-hidden="true" />
                  Phê duyệt chuyển kho
                </NavLink>
                <NavLink className="app-nav-child" to="/inventory/history">
                  <List size={14} aria-hidden="true" />
                  Lịch sử giao dịch
                </NavLink>
                <NavLink className="app-nav-child" to="/inventory/alerts">
                  <List size={14} aria-hidden="true" />
                  Cảnh báo tồn kho
                </NavLink>
              </div>
            ) : null}
          </div>
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
        </nav>

        {isAdmin && (
          <nav className="app-admin-nav" aria-label="Quản trị hệ thống">
            <NavLink className="app-nav-link" to="/audit-logs">
              <BarChart3 size={16} aria-hidden="true" />
              Nhật ký hệ thống
            </NavLink>
          </nav>
        )}
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

      <div className="app-content">
        <header className="app-topbar">
          <div className="app-topbar-spacer" />
          
          {/* Notification Bell & Dropdown */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button className="app-topbar-icon" type="button" aria-label="Thông báo" onClick={() => setNotifOpen(!notifOpen)}>
              <Bell size={19} aria-hidden="true" />
              {hasUnread && <span className="app-notification-dot" aria-hidden="true" />}
            </button>
            
            {notifOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, width: 340, marginTop: 8,
                background: '#fff', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 100,
                display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--ink-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--ink-900)' }}>Thông báo mới</h3>
                </div>
                
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {!hasUnread ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>
                      Không có thông báo mới
                    </div>
                  ) : (
                    unreadData.map(notif => (
                      <div key={notif.id} onClick={async () => {
                        try {
                          await markNotificationRead(notif.id);
                          unreadQuery.refetch();
                          navigate('/dashboard/notifications');
                          setNotifOpen(false);
                        } catch(e) {}
                      }} style={{
                        padding: '12px 16px', borderBottom: '1px solid var(--ink-100)', cursor: 'pointer',
                        transition: 'background 0.2s', background: 'var(--accent-50)'
                      }} onMouseOver={e => e.currentTarget.style.background = 'var(--accent-100)'}
                         onMouseOut={e => e.currentTarget.style.background = 'var(--accent-50)'}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-900)', marginBottom: 4 }}>{notif.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-600)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notif.body}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-400)', marginTop: 4 }}>
                          {notif.createdAt ? new Date(notif.createdAt).toLocaleString('vi-VN') : ''}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div style={{ padding: 8, borderTop: '1px solid var(--ink-200)', textAlign: 'center' }}>
                  <button type="button" className="btn btn-ghost" style={{ width: '100%', fontSize: 13, color: 'var(--accent-700)' }} 
                    onClick={() => { setNotifOpen(false); navigate('/dashboard/notifications'); }}>
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            )}
          </div>

          {user ? (
            <NavLink className="app-user-menu" to={`/users/${user.id}`}>
              <CircleUserRound size={27} aria-hidden="true" />
              <span>{user.fullName || 'Admin'}</span>
              <ChevronDown size={15} aria-hidden="true" />
            </NavLink>
          ) : (
            <span className="app-user-menu" aria-label="Current user">
              <CircleUserRound size={27} aria-hidden="true" />
              <span>Quản trị viên</span>
              <ChevronDown size={15} aria-hidden="true" />
            </span>
          )}
          <button
            className="app-topbar-icon"
            type="button"
            title="Đăng xuất"
            aria-label="Đăng xuất"
            onClick={handleLogout}
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </header>

        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}
