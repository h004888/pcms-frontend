import { useQuery } from '@tanstack/react-query'
import { AlertCircle, ArrowLeft, CalendarDays, Package } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '@core/router/paths.js'
import { getApiErrorMessage } from '@core/http/apiClient'
import { getCustomerOrderDetail, getCustomerOrderTracking } from '../api/shopApi'
import { OrderTimeline } from '../components/OrderTimeline'
import { useAuth } from '../hooks/useAuth'
import { formatOrderDate, formatOrderPrice, getOrderStatusPresentation } from '../utils/orderPresentation'

function ErrorBlock({ error, onRetry }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700"><div className="flex items-center gap-3"><AlertCircle size={20} /><p>{getApiErrorMessage(error)}</p></div><button className="min-h-11 rounded-xl border border-red-300 px-4 text-sm font-semibold hover:bg-red-100" onClick={onRetry} type="button">Thử lại</button></div>
}

export function OrderDetailPage() {
  const { orderId } = useParams()
  const { isAuthenticated } = useAuth()
  const detail = useQuery({ queryKey: ['customer-order-detail', orderId], queryFn: () => getCustomerOrderDetail(orderId), enabled: isAuthenticated && !!orderId })
  const tracking = useQuery({ queryKey: ['customer-order-tracking', orderId], queryFn: () => getCustomerOrderTracking(orderId), enabled: isAuthenticated && !!orderId })
  if (!isAuthenticated) return <main className="mx-auto max-w-7xl px-4 py-16 text-center"><p className="text-slate-600">Vui lòng đăng nhập để xem đơn hàng.</p><Link className="mt-3 inline-block font-semibold text-blue-700 hover:underline" to="/login">Đăng nhập</Link></main>
  if (detail.isLoading) return <main className="mx-auto max-w-7xl animate-pulse px-4 py-8"><div className="h-8 w-64 rounded bg-slate-100" /><div className="mt-6 h-96 rounded-2xl bg-slate-100" /></main>
  if (detail.isError) return <main className="mx-auto max-w-3xl px-4 py-12"><ErrorBlock error={detail.error} onRetry={() => detail.refetch()} /></main>
  const order = detail.data || {}
  const status = getOrderStatusPresentation(order.status)
  const items = order.items || []
  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-700 hover:underline" to={ROUTES.MY_ORDERS}><ArrowLeft size={16} />Quay lại đơn hàng</Link>
    <header className="mt-5 flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-sm text-slate-500">#{order.orderNumber || order.id}</p><h1 className="mt-1 text-3xl font-bold text-slate-900">Chi tiết đơn hàng</h1><p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><CalendarDays size={16} />{formatOrderDate(order.createdAt)}</p></div><div className="text-right"><span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${status.tone}`}>{status.label}</span><p className="mt-3 text-xl font-bold text-slate-900">{formatOrderPrice(order.total)}</p></div></header>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"><section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><Package size={20} />Sản phẩm</h2><div className="mt-5 divide-y divide-slate-100">{items.map((item, index) => <div className="grid gap-3 py-4 sm:grid-cols-[1fr_auto_auto]" key={item.medicineId || index}><div><p className="font-semibold text-slate-800">{item.medicineName || 'Sản phẩm'}</p><p className="mt-1 text-sm text-slate-500">Số lượng: {item.quantity ?? 0}</p></div><p className="text-sm text-slate-600">{formatOrderPrice(item.unitPrice)}</p><p className="font-semibold text-slate-900">{formatOrderPrice(item.subtotal)}</p>{Number(item.discount) > 0 && <p className="text-xs text-emerald-700 sm:col-span-3">Giảm {formatOrderPrice(item.discount)}</p>}</div>)}</div></section><aside className="space-y-6"><section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-lg font-bold text-slate-900">Tổng thanh toán</h2><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4 text-slate-600"><dt>Tạm tính</dt><dd>{formatOrderPrice(order.subtotal)}</dd></div><div className="flex justify-between gap-4 text-slate-600"><dt>Giảm giá</dt><dd>-{formatOrderPrice(order.discount)}</dd></div><div className="flex justify-between gap-4 border-t border-slate-100 pt-3 font-bold text-slate-900"><dt>Tổng cộng</dt><dd>{formatOrderPrice(order.total)}</dd></div></dl></section><section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="mb-5 text-lg font-bold text-slate-900">Lịch sử trạng thái</h2>{tracking.isLoading && <div className="h-40 animate-pulse rounded bg-slate-100" />}{tracking.isError && <ErrorBlock error={tracking.error} onRetry={() => tracking.refetch()} />}{!tracking.isLoading && !tracking.isError && <OrderTimeline events={tracking.data?.events || tracking.data?.timeline || []} />}</section></aside></div>
  </main>
}
