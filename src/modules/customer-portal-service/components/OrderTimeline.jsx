import { Check, Circle, Clock, X } from 'lucide-react'
import { formatOrderDateTime, getOrderStatusPresentation } from '../utils/orderPresentation'

export function OrderTimeline({ events, timeline }) {
  const items = events || timeline
  if (!items || items.length === 0) return <p className="text-sm text-slate-500">Chưa có lịch sử trạng thái.</p>

  return <ol className="space-y-0">{items.map((event, index) => {
    const status = event.status || event.label
    const presentation = getOrderStatusPresentation(status)
    const displayLabel = event.status ? presentation.label : event.label
    const isLegacyDone = event.isCompleted
    const isCurrent = event.isCurrent || index === items.length - 1
    const Icon = presentation.group === 'rejected' || presentation.group === 'cancelled' ? X : isCurrent ? Clock : isLegacyDone || event.occurredAt ? Check : Circle
    return <li className="relative flex gap-4 pb-6 last:pb-0" key={`${status}-${event.occurredAt || event.timestamp || index}`}>
      {index < items.length - 1 && <span className="absolute bottom-0 left-4 top-8 w-px bg-slate-200" />}
      <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${isCurrent ? presentation.tone : 'border-slate-200 bg-white text-slate-400'}`}><Icon size={15} /></span>
      <div className="min-w-0 pt-1"><p className={`text-sm font-semibold ${isCurrent ? 'text-slate-900' : 'text-slate-600'}`}>{displayLabel}</p><p className="mt-1 text-xs text-slate-500">{formatOrderDateTime(event.occurredAt || event.timestamp)}</p>{event.note && <p className="mt-1 text-sm text-slate-600">{event.note}</p>}</div>
    </li>
  })}</ol>
}
