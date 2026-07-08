import { Building2, LayoutDashboard, PackageCheck, Pill } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export function DashboardLayout({ children }) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Điều hướng chính">
        <div className="app-brand">
          <span className="app-brand-mark">P</span>
          <span className="app-brand-text">
            <span className="app-brand-title">PCMS</span>
            <span className="app-brand-subtitle">Pharmacy Console</span>
          </span>
        </div>

        <nav className="app-nav">
          <NavLink className="app-nav-link" to="/branches">
            <Building2 size={16} aria-hidden="true" />
            Chi nhánh
          </NavLink>
          <NavLink className="app-nav-link" to="/medicines">
            <Pill size={16} aria-hidden="true" />
            Thuốc
          </NavLink>
          <NavLink className="app-nav-link" to="/inventory">
            <PackageCheck size={16} aria-hidden="true" />
            Tồn kho
          </NavLink>
          <span className="app-nav-link" aria-disabled="true">
            <LayoutDashboard size={16} aria-hidden="true" />
            Tổng quan
          </span>
        </nav>
      </aside>

      <main className="app-main">{children}</main>
    </div>
  )
}
