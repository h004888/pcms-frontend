const ORDERS_KEY = 'pcms_orders'

function readOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

const TIMELINE_TEMPLATE = [
  { status: 'confirmed', label: 'Đã đặt hàng', note: 'Đơn hàng đã được ghi nhận' },
  { status: 'verified', label: 'Đã xác nhận', note: 'Nhà thuốc đã xác nhận đơn hàng' },
  { status: 'packing', label: 'Đang đóng gói', note: 'Dược sĩ đang chuẩn bị hàng' },
  { status: 'handover', label: 'Đã bàn giao vận chuyển', note: 'Đơn hàng đã bàn giao cho đơn vị vận chuyển' },
  { status: 'shipping', label: 'Đang giao hàng', note: 'Đơn hàng đang trên đường giao' },
  { status: 'delivered', label: 'Đã giao hàng', note: 'Đơn hàng đã được giao thành công' },
]

function buildTimeline(orderStatus) {
  const now = new Date()
  const orderDate = new Date(now.getTime() - 30 * 60 * 1000) // 30 phút trước

  return TIMELINE_TEMPLATE.map((step, index) => {
    const statusIndex = TIMELINE_TEMPLATE.findIndex((s) => s.status === orderStatus)
    const isCompleted = index <= statusIndex
    const isCurrent = index === statusIndex

    let timestamp = null
    if (index === 0 && isCompleted) {
      timestamp = orderDate.toISOString()
    } else if (isCompleted && index > 0) {
      timestamp = new Date(orderDate.getTime() + index * 15 * 60 * 1000).toISOString()
    }

    return {
      status: step.status,
      label: step.label,
      note: isCurrent ? step.note : (isCompleted ? step.note : null),
      timestamp,
      isCompleted,
      isCurrent,
    }
  })
}

export function getOrder(orderNumber) {
  const orders = readOrders()
  return orders.find((o) => o.orderNumber === orderNumber) || null
}

export function findOrdersByPhone(phone) {
  const orders = readOrders()
  const cleaned = phone.replace(/\s/g, '')
  return orders.filter((o) => o.phone.replace(/\s/g, '') === cleaned)
}

export function getOrderTimelineTemplate() {
  return TIMELINE_TEMPLATE
}
