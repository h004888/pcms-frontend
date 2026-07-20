import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { getCustomer, getCustomerOrders, getCustomerPoints } from '../api/customerApi.js'
import {
  formatCurrency,
  formatDate,
  formatPointAction,
  formatPoints,
  formatRefOrder,
  formatTierColor,
  formatTierLabel,
} from '../services/customerFormatters.js'

const TAB_LABELS = {
  points: 'Lịch sử điểm',
  orders: 'Lịch sử đơn hàng',
  vouchers: 'Vouchers',
}

const ORDER_STATUS_MAP = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
  RETURNED: 'Hoàn trả',
}

export function CustomerDetailPage() {
  const { customerId } = useParams()
  const [activeTab, setActiveTab] = useState('points')

  const customerQuery = useQuery({
    queryKey: ['customers', customerId],
    queryFn: () => getCustomer(customerId),
    enabled: Boolean(customerId),
  })

  const pointsQuery = useQuery({
    queryKey: ['customers', customerId, 'points'],
    queryFn: () => getCustomerPoints(customerId),
    enabled: Boolean(customerId) && activeTab === 'points',
  })

  const ordersQuery = useQuery({
    queryKey: ['customers', customerId, 'orders'],
    queryFn: () => getCustomerOrders(customerId),
    enabled: Boolean(customerId) && activeTab === 'orders',
  })

  if (customerQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="empty-state">Đang tải thông tin khách hàng...</div>
      </DashboardLayout>
    )
  }

  if (customerQuery.isError) {
    return (
      <DashboardLayout>
        <div className="error-state" role="alert">
          {getApiErrorMessage(customerQuery.error)}
        </div>
      </DashboardLayout>
    )
  }

  const customer = customerQuery.data
  const pointsList = pointsQuery.data?.data || []
  const ordersList = ordersQuery.data?.data || []

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">Chi tiết: {customer.name}</h1>
            <p className="page-description">
              <span className="mono">{customer.code}</span>
              {customer.phone ? ` · ${customer.phone}` : ''}
            </p>
          </div>
          <Link className="btn btn-outline" to="/customers">
            <ArrowLeft size={16} aria-hidden="true" />
            Danh sách
          </Link>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            gap: 24,
            alignItems: 'start',
          }}
        >
          <nav className="card" style={{ padding: 0 }} aria-label="Điều hướng chi tiết khách hàng">
            {Object.entries(TAB_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className="app-nav-link"
                data-active={activeTab === key || undefined}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === key ? 'var(--accent-50)' : 'transparent',
                  color: activeTab === key ? 'var(--accent-700)' : 'inherit',
                  fontWeight: activeTab === key ? 600 : 'inherit',
                }}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div>
            {activeTab === 'points' && (
              <section className="card" aria-labelledby="points-title">
                <div className="card-header">
                  <div>
                    <h2 className="card-title" id="points-title">
                      Điểm tích lũy hiện tại:{' '}
                      <span className="mono">{formatPoints(customer.points)} pts</span>
                    </h2>
                    <p className="card-subtitle" style={{ color: formatTierColor(customer.tier), fontWeight: 600 }}>
                      Hạng: {formatTierLabel(customer.tier).toUpperCase()} MEMBER
                    </p>
                  </div>
                </div>

                <div className="card-body">
                  <h3 className="card-title" style={{ marginBottom: 12 }}>
                    Nhật ký giao dịch điểm
                  </h3>
                </div>

                {pointsQuery.isLoading ? (
                  <div className="empty-state">Đang tải lịch sử điểm...</div>
                ) : pointsQuery.isError ? (
                  <div className="card-body">
                    <div className="error-state" role="alert">
                      {getApiErrorMessage(pointsQuery.error)}
                    </div>
                  </div>
                ) : pointsList.length === 0 ? (
                  <div className="empty-state">Chưa có giao dịch điểm nào.</div>
                ) : (
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Ngày</th>
                          <th>Hành động</th>
                          <th>Mã đơn hàng</th>
                          <th>Thay đổi điểm</th>
                          <th>Số dư</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pointsList.map((tx) => (
                          <tr key={tx.id}>
                            <td>{formatDate(tx.createdAt)}</td>
                            <td>{formatPointAction(tx.reason)}</td>
                            <td className="mono">{formatRefOrder(tx.refOrderId)}</td>
                            <td
                              className="mono"
                              style={{ color: tx.points >= 0 ? 'var(--accent-700)' : 'var(--danger-600)', fontWeight: 600 }}
                            >
                              {tx.points >= 0 ? `+${tx.points}` : tx.points}
                            </td>
                            <td className="mono">{formatPoints(tx.balanceAfter)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'orders' && (
              <section className="card" aria-labelledby="orders-title">
                <div className="card-header">
                  <div>
                    <h2 className="card-title" id="orders-title">
                      Lịch sử đơn hàng
                    </h2>
                    <p className="card-subtitle">Các đơn hàng của khách hàng này.</p>
                  </div>
                </div>

                {ordersQuery.isLoading ? (
                  <div className="empty-state">Đang tải lịch sử đơn hàng...</div>
                ) : ordersQuery.isError ? (
                  <div className="card-body">
                    <div className="error-state" role="alert">
                      {getApiErrorMessage(ordersQuery.error)}
                    </div>
                  </div>
                ) : ordersList.length === 0 ? (
                  <div className="empty-state">Chưa có đơn hàng nào.</div>
                ) : (
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Mã đơn</th>
                          <th>Ngày đặt</th>
                          <th>Tổng tiền</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersList.map((order) => (
                          <tr key={order.id}>
                            <td className="mono">{order.orderNumber}</td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td className="mono">{formatCurrency(order.total)}</td>
                            <td>{ORDER_STATUS_MAP[order.status] || order.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'vouchers' && (
              <section className="card" aria-labelledby="vouchers-title">
                <div className="card-header">
                  <div>
                    <h2 className="card-title" id="vouchers-title">
                      Vouchers
                    </h2>
                    <p className="card-subtitle">Voucher và ưu đãi của khách hàng.</p>
                  </div>
                </div>
                <div className="empty-state">Chưa có voucher nào.</div>
              </section>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
