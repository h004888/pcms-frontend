import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Package } from 'lucide-react'
import { ROUTES } from '@core/router/paths.js'
import { formatOrderDate, formatOrderPrice, getOrderStatusPresentation } from '../utils/orderPresentation'

export function OrderSummaryCard({ order }) {
  const status = getOrderStatusPresentation(order.status)
  const items = order.items || order.itemPreview || []
  const itemCount = order.itemCount ?? items.length
  const extraCount = Math.max(0, itemCount - items.length)
  const total = order.total ?? order.totalAmount

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-300">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <p className="font-mono text-sm font-semibold text-slate-800">#{order.orderNumber || order.id}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays size={14} />{formatOrderDate(order.createdAt)}</p>
        </div>
        <span className={`mt-1 rounded-full border px-3 py-1 text-xs font-semibold ${status.tone}`}>{status.label}</span>
      </div>
      <div className="flex-1 py-4">
        <div className="space-y-2">
          {items.slice(0, 3).map((item, index) => (
            <div className="flex justify-between gap-4 text-sm text-slate-700" key={item.medicineId || index}>
              <span className="truncate">{item.medicineName || item.name || 'Sản phẩm'} <span className="text-slate-400">x{item.quantity ?? item.qty ?? 1}</span></span>
            </div>
          ))}
        </div>
        {extraCount > 0 && <p className="mt-2 text-xs text-slate-500">và {extraCount} sản phẩm khác</p>}
      </div>
      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-4">
        <p className="flex items-center gap-2 text-sm text-slate-500"><Package size={16} />{itemCount} sản phẩm</p>
        <div className="text-right"><p className="text-xs text-slate-500">Tổng tiền</p><p className="text-lg font-bold text-slate-900">{formatOrderPrice(total)}</p></div>
      </div>
      <Link className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500" to={ROUTES.ORDER_DETAIL(order.id)}>
        Xem chi tiết <ArrowRight size={16} />
      </Link>
    </article>
  )
}
