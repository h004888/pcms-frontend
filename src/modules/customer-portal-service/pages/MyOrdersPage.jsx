import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, ChevronLeft, ChevronRight, Package, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCustomerOrders } from '../api/shopApi'
import { OrderSummaryCard } from '../components/OrderSummaryCard'
import { useAuth } from '../hooks/useAuth'
import { getApiErrorMessage } from '@core/http/apiClient'

const TABS = [['', 'Tất cả'], ['PENDING_PAYMENT', 'Chờ thanh toán'], ['APPROVED', 'Đã xác nhận'], ['PAID', 'Đã thanh toán'], ['COMPLETED', 'Hoàn tất'], ['REJECTED', 'Bị từ chối'], ['CANCELLED', 'Đã hủy']]

function getPageData(data) {
  return { orders: data?.data || (Array.isArray(data) ? data : []), total: data?.totalElements ?? data?.total ?? 0, pages: data?.totalPages ?? 1, page: data?.page ?? 0 }
}

export function MyOrdersPage() {
  const { isAuthenticated } = useAuth()
  const [status, setStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const invalidRange = dateFrom && dateTo && dateFrom > dateTo
  const query = useQuery({
    queryKey: ['customer-orders', { status, dateFrom, dateTo, page, size: 10 }],
    queryFn: () => getCustomerOrders({ status: status || undefined, dateFrom: invalidRange ? undefined : dateFrom || undefined, dateTo: invalidRange ? undefined : dateTo || undefined, page, size: 10 }),
    enabled: isAuthenticated,
  })
  const pageData = getPageData(query.data)
  const filteredOrders = pageData.orders.filter((order) => {
    const needle = search.trim().toLowerCase()
    return !needle || `${order.orderNumber || ''} ${(order.items || order.itemPreview || []).map((item) => item.medicineName || item.name).join(' ')}`.toLowerCase().includes(needle)
  })
  const reset = () => { setStatus(''); setDateFrom(''); setDateTo(''); setSearch(''); setPage(0) }

  if (!isAuthenticated) return <div className="mx-auto flex min-h-[40vh] max-w-7xl items-center justify-center px-4"><div className="text-center"><p className="text-slate-600">Vui lòng đăng nhập để xem đơn hàng.</p><Link className="mt-3 inline-block font-semibold text-blue-700 hover:underline" to="/login">Đăng nhập</Link></div></div>

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8"><p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Lịch sử mua hàng</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Đơn hàng của tôi</h1><p className="mt-2 text-slate-600">Theo dõi trạng thái và xem chi tiết đơn hàng của bạn.</p><p className="mt-3 text-sm text-slate-500">{pageData.total} đơn hàng</p></header>
      <div className="mb-5 overflow-x-auto border-b border-slate-200"><div className="flex min-w-max gap-1" role="tablist" aria-label="Lọc theo trạng thái">
        {TABS.map(([value, label]) => <button key={value || 'all'} type="button" role="tab" aria-current={status === value ? 'page' : undefined} onClick={() => { setStatus(value); setPage(0) }} className={`min-h-11 whitespace-nowrap border-b-2 px-3 text-sm font-semibold transition-colors ${status === value ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'}`}>{label}</button>)}
      </div></div>
      <section className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto] md:items-end">
        <label className="block text-sm font-semibold text-slate-700"><span className="sr-only">Tìm đơn hàng</span><span className="mb-2 block">Tìm kiếm</span><div className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input className="min-h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Mã đơn hoặc tên sản phẩm" />{search && <button aria-label="Xóa tìm kiếm" className="absolute right-2 top-2.5 rounded-lg p-1 text-slate-500 hover:bg-slate-100" onClick={() => setSearch('')} type="button"><X size={18} /></button>}</div></label>
        <label className="text-sm font-semibold text-slate-700">Từ ngày<input className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="date" value={dateFrom} onChange={(event) => { setDateFrom(event.target.value); setPage(0) }} /></label>
        <label className="text-sm font-semibold text-slate-700">Đến ngày<input className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="date" value={dateTo} onChange={(event) => { setDateTo(event.target.value); setPage(0) }} /></label>
        <button className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100" type="button" onClick={reset}>Xóa bộ lọc</button>
      </div>{invalidRange && <p className="mt-3 text-sm text-red-700">Ngày bắt đầu không được sau ngày kết thúc.</p>}</section>
      {query.isLoading && <div className="grid gap-4 md:grid-cols-2"><div className="h-64 animate-pulse rounded-2xl bg-slate-100" /><div className="h-64 animate-pulse rounded-2xl bg-slate-100" /></div>}
      {query.isError && <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700"><div className="flex items-center gap-3"><AlertCircle size={20} /><p>{getApiErrorMessage(query.error)}</p></div><button className="min-h-11 rounded-xl border border-red-300 px-4 text-sm font-semibold hover:bg-red-100" onClick={() => query.refetch()} type="button">Thử lại</button></div>}
      {!query.isLoading && !query.isError && filteredOrders.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center"><Package className="mx-auto mb-4 text-slate-300" size={42} /><p className="font-semibold text-slate-800">{search || status || dateFrom || dateTo ? 'Không có đơn phù hợp bộ lọc' : 'Bạn chưa có đơn hàng nào'}</p>{search || status || dateFrom || dateTo ? <button className="mt-3 font-semibold text-blue-700 hover:underline" onClick={reset} type="button">Xóa bộ lọc</button> : <Link className="mt-3 inline-block font-semibold text-blue-700 hover:underline" to="/">Tiếp tục mua sắm</Link>}</div>}
      {!query.isLoading && !query.isError && filteredOrders.length > 0 && <><div className="grid gap-4 md:grid-cols-2">{filteredOrders.map((order) => <OrderSummaryCard key={order.id || order.orderNumber} order={order} />)}</div><div className="mt-6 flex items-center justify-between gap-4"><button className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-slate-300 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40" disabled={pageData.page <= 0} onClick={() => setPage((current) => current - 1)} type="button"><ChevronLeft size={16} />Trước</button><span className="text-sm text-slate-500">Trang {pageData.page + 1} / {Math.max(pageData.pages, 1)}</span><button className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-slate-300 px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40" disabled={pageData.page + 1 >= pageData.pages} onClick={() => setPage((current) => current + 1)} type="button">Sau<ChevronRight size={16} /></button></div></>}
    </main>
  )
}
