import { AlertTriangle, CheckCircle2, CircleSlash2, Clock3 } from 'lucide-react'
import { getStockStatus, stockStatusMeta, STOCK_STATUS } from '../services/inventoryFormatters.js'

export function StockStatusBadge({ row }) {
  const status = getStockStatus(row)
  const meta = stockStatusMeta(status)
  const Icon =
    status === STOCK_STATUS.OK
      ? CheckCircle2
      : status === STOCK_STATUS.OUT || status === STOCK_STATUS.EXPIRED
        ? CircleSlash2
        : status === STOCK_STATUS.EXPIRING
          ? Clock3
          : AlertTriangle

  return (
    <span className={`badge ${meta.className}`}>
      <Icon size={13} aria-hidden="true" />
      {meta.label}
    </span>
  )
}
