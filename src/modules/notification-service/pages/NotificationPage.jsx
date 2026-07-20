import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Bell,
  Send,
  RefreshCcw,
  CheckCheck,
  Megaphone,
  Package,
  Clock,
  ShoppingCart,
  Plus,
  X,
  Eye,
  Trash2,
  AlertTriangle,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import {
  listNotifications,
  broadcastNotification,
  composeNotification,
  markNotificationRead,
  markAllNotificationsRead,
  retryNotification,
  deleteNotification,
  triggerLowStockNotification,
  triggerExpiryAlertNotification,
  triggerOrderPaidNotification,
} from '../api/notificationApi.js'

const TAB_INBOX = 'inbox'
const TAB_COMPOSE = 'compose'
const TAB_OUTBOX = 'outbox'

// ─── Status Badge ─────────────────────────────────────────────────────────────
function NotifStatusBadge({ status }) {
  const map = {
    SENT: { cls: 'badge-success', label: 'Đã gửi' },
    READ: { cls: 'badge-muted', label: 'Đã đọc' },
    FAILED: { cls: 'badge-danger', label: 'Lỗi' },
    PENDING: { cls: 'badge-info', label: 'Chờ gửi' },
  }
  const { cls, label } = map[status] || { cls: 'badge-muted', label: status }
  return <span className={`badge ${cls}`}>{label}</span>
}

// ─── Channel Badge ────────────────────────────────────────────────────────────
function ChannelBadge({ channel }) {
  const map = {
    IN_APP: { cls: 'badge-info', label: '📱 In-App' },
    EMAIL: { cls: 'badge-success', label: '📧 Email' },
    SMS: { cls: 'badge-muted', label: '📱 SMS (Mock)' },
  }
  const { cls, label } = map[channel] || { cls: 'badge-muted', label: channel }
  return <span className={`badge ${cls}`}>{label}</span>
}

// ─── Inbox Tab ────────────────────────────────────────────────────────────────
function InboxTab() {
  const user = (() => { try { return JSON.parse(localStorage.getItem('pcms_user') || '{}') } catch { return {} } })()
  const recipientId = user.id || ''
  const [statusFilter, setStatusFilter] = useState('all')
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['notifications', recipientId, statusFilter],
    queryFn: () => listNotifications({ recipientId, status: statusFilter, page: 0, size: 50 }),
    enabled: !!recipientId,
  })

  const items = useMemo(() => {
    const data = query.data
    if (!data) return []
    if (Array.isArray(data.content)) return data.content
    if (Array.isArray(data.data)) return data.data
    if (Array.isArray(data)) return data
    return []
  }, [query.data])

  async function handleMarkRead(id) {
    try {
      await markNotificationRead(id)
      toast.success('Đã đánh dấu đã đọc.')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    } catch (e) { toast.error(getApiErrorMessage(e)) }
  }

  async function handleMarkAllRead() {
    if (!recipientId) return
    try {
      await markAllNotificationsRead(recipientId)
      toast.success('Đã đánh dấu tất cả là đã đọc.')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    } catch (e) { toast.error(getApiErrorMessage(e)) }
  }

  async function handleRetry(id) {
    try {
      await retryNotification(id)
      toast.success('Đã thử gửi lại thông báo.')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    } catch (e) { toast.error(getApiErrorMessage(e)) }
  }

  function fmt(val) {
    if (!val) return '—'
    try { return new Date(val).toLocaleString('vi-VN') } catch { return val }
  }

  const unreadCount = items.filter(n => n.status === 'SENT').length

  return (
    <div className="page-stack">
      {/* Stats */}
      <section className="inventory-stat-grid" aria-label="Tổng quan thông báo">
        <div className="stat-card">
          <div><p className="stat-title">Chưa đọc</p><p className="stat-value mono">{unreadCount}</p></div>
          <Bell color="var(--warning-700)" size={24} />
        </div>
        <div className="stat-card">
          <div><p className="stat-title">Tổng thông báo</p><p className="stat-value mono">{items.length}</p></div>
          <Bell color="var(--ink-500)" size={24} />
        </div>
      </section>

      <section className="card" aria-labelledby="inbox-title">
        <div className="card-header">
          <div>
            <h2 className="card-title" id="inbox-title">Hộp thư ({items.length})</h2>
            {!recipientId && <p className="card-subtitle" style={{ color: 'var(--warning-700)' }}>Cần đăng nhập để xem thông báo.</p>}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select className="select" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="unread">Chưa đọc</option>
              <option value="read">Đã đọc</option>
            </select>
            {unreadCount > 0 && (
              <button className="btn btn-outline" type="button" onClick={handleMarkAllRead}>
                <CheckCheck size={16} /> Đọc tất cả
              </button>
            )}
            <button className="btn btn-ghost btn-icon" type="button" onClick={() => query.refetch()} title="Tải lại">
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>

        {!recipientId ? (
          <div className="empty-state">Vui lòng đăng nhập để xem thông báo của bạn.</div>
        ) : query.isLoading ? (
          <div className="empty-state">Đang tải thông báo...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">Không có thông báo nào.</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Nội dung</th>
                  <th>Loại</th>
                  <th>Kênh</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                  <th aria-label="Thao tác" />
                </tr>
              </thead>
              <tbody>
                {items.map(n => (
                  <tr key={n.id} style={{ background: n.status === 'SENT' ? 'var(--accent-50)' : undefined }}>
                    <td style={{ fontWeight: n.status === 'SENT' ? 700 : 400 }}>{n.title}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ink-600)' }}>{n.body}</td>
                    <td><span className="badge badge-muted" style={{ fontSize: 11 }}>{n.template || n.type || '—'}</span></td>
                    <td><ChannelBadge channel={n.channel} /></td>
                    <td><NotifStatusBadge status={n.status} /></td>
                    <td className="mono" style={{ fontSize: 12 }}>{fmt(n.createdAt || n.scheduledAt)}</td>
                    <td>
                      <div className="table-actions">
                        {n.status === 'SENT' && (
                          <button className="btn btn-outline btn-icon" type="button" title="Đánh dấu đã đọc"
                            onClick={() => handleMarkRead(n.id)} aria-label="Đánh dấu đã đọc">
                            <Eye size={16} />
                          </button>
                        )}
                        {n.status === 'FAILED' && (
                          <button className="btn btn-outline btn-icon" type="button" title="Thử gửi lại"
                            onClick={() => handleRetry(n.id)} style={{ color: 'var(--warning-700)' }}>
                            <RefreshCcw size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

// ─── Compose Tab ─────────────────────────────────────────────────────────────
function ComposeTab() {
  const [composeMode, setComposeMode] = useState('broadcast') // 'broadcast' | 'template'
  const [form, setForm] = useState({
    title: '',
    body: '',
    channel: 'IN_APP',
    template: 'MANUAL',
    targetRole: '',
  })
  const [sending, setSending] = useState(false)

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleBroadcast(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) {
      toast.error('Tiêu đề và nội dung là bắt buộc.')
      return
    }
    setSending(true)
    try {
      const payload = {
        title: form.title,
        body: form.body,
        channel: form.channel,
        template: form.template,
        targetRole: form.targetRole || undefined,
      }
      await broadcastNotification(payload)
      toast.success('Đã gửi thông báo broadcast thành công! (@Async thread pool đang xử lý)')
      setForm(f => ({ ...f, title: '', body: '' }))
    } catch (e) { toast.error(getApiErrorMessage(e)) }
    finally { setSending(false) }
  }

  async function handleCompose(e) {
    e.preventDefault()
    setSending(true)
    try {
      const payload = {
        title: form.title,
        body: form.body,
        channel: form.channel,
        template: form.template,
        targetRole: form.targetRole || undefined,
      }
      await composeNotification(payload)
      toast.success('Đã soạn và gửi thông báo qua template!')
    } catch (e) { toast.error(getApiErrorMessage(e)) }
    finally { setSending(false) }
  }

  return (
    <div className="page-stack">
      {/* Async info banner */}
      <div style={{
        padding: '12px 16px', background: 'var(--accent-50)', border: '1px solid var(--accent-100)',
        borderRadius: 'var(--radius-md)', display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <Zap size={18} color="var(--accent-700)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: 'var(--accent-700)' }}>
            Xử lý bất đồng bộ (@Async)
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--ink-600)' }}>
            Tất cả thông báo được gửi qua <code>notificationTaskExecutor</code> thread pool riêng. 
            SMS dùng <strong>MockSmsSender</strong> — log ra console thay vì gửi thật (không tốn phí). 
            Hệ thống tự retry tối đa 3 lần với linear backoff 1000ms.
          </p>
        </div>
      </div>

      <section className="card" aria-labelledby="compose-title">
        <div className="card-header">
          <h2 className="card-title" id="compose-title">Soạn thông báo</h2>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'broadcast', label: 'Broadcast' },
              { id: 'template', label: 'Theo Template' },
            ].map(m => (
              <button key={m.id} type="button" className={`btn ${composeMode === m.id ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: 13 }} onClick={() => setComposeMode(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <form className="card-body" style={{ display: 'grid', gap: 16 }}
          onSubmit={composeMode === 'broadcast' ? handleBroadcast : handleCompose} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label className="field-label" htmlFor="notif-channel">Kênh gửi</label>
              <select id="notif-channel" className="select" value={form.channel} onChange={e => setField('channel', e.target.value)}>
                <option value="IN_APP">📱 In-App</option>
                <option value="EMAIL">📧 Email</option>
                <option value="SMS">📱 SMS (MockSmsSender)</option>
              </select>
              {form.channel === 'SMS' && (
                <p className="field-hint" style={{ color: 'var(--warning-700)' }}>
                  ⚠️ SMS dùng MockSmsSender — log ra console, không gửi thật
                </p>
              )}
            </div>
            <div className="field">
              <label className="field-label" htmlFor="notif-template">Template</label>
              <select id="notif-template" className="select" value={form.template} onChange={e => setField('template', e.target.value)}>
                <option value="MANUAL">MANUAL</option>
                <option value="ORDER_PAID">ORDER_PAID</option>
                <option value="LOW_STOCK">LOW_STOCK</option>
                <option value="EXPIRY_ALERT">EXPIRY_ALERT</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="notif-role">Gửi đến nhóm (role)</label>
              <select id="notif-role" className="select" value={form.targetRole} onChange={e => setField('targetRole', e.target.value)}>
                <option value="">— Tất cả —</option>
                <option value="ADMIN">ADMIN</option>
                <option value="CEO">CEO</option>
                <option value="BRANCH_MANAGER">BRANCH_MANAGER</option>
                <option value="PHARMACIST">PHARMACIST</option>
                <option value="STAFF">STAFF</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="notif-title">Tiêu đề <span style={{ color: 'var(--danger-500)' }}>*</span></label>
            <input id="notif-title" className="input" placeholder="Thông báo quan trọng từ PCMS"
              value={form.title} onChange={e => setField('title', e.target.value)} required />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="notif-body">Nội dung <span style={{ color: 'var(--danger-500)' }}>*</span></label>
            <textarea id="notif-body" className="textarea" rows={4} placeholder="Nội dung thông báo..."
              value={form.body} onChange={e => setField('body', e.target.value)} required />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={sending}>
              <Send size={16} /> {sending ? 'Đang gửi...' : composeMode === 'broadcast' ? 'Broadcast' : 'Gửi qua Template'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

// ─── Outbox Tab ───────────────────────────────────────────────────────────────
function OutboxTab() {
  const [activeTrigger, setActiveTrigger] = useState(null) // 'low-stock' | 'expiry' | 'order-paid'
  const [triggerForm, setTriggerForm] = useState({})
  const [sending, setSending] = useState(false)

  const triggers = [
    {
      id: 'low-stock',
      label: 'Low Stock Alert',
      icon: Package,
      color: 'var(--warning-700)',
      desc: 'Gửi cảnh báo tồn kho thấp. Dùng Outbox Pattern — lưu vào OutboxLog để tránh duplicate.',
      fields: [
        { key: 'medicineId', label: 'Medicine ID (UUID)', type: 'text', placeholder: 'uuid...' },
        { key: 'medicineName', label: 'Tên thuốc', type: 'text', placeholder: 'Paracetamol 500mg' },
        { key: 'branchId', label: 'Branch ID (UUID)', type: 'text', placeholder: 'uuid...' },
        { key: 'qtyOnHand', label: 'Tồn hiện tại', type: 'number', placeholder: '5' },
        { key: 'minQty', label: 'Mức tối thiểu', type: 'number', placeholder: '20' },
      ],
      handler: triggerLowStockNotification,
    },
    {
      id: 'expiry',
      label: 'Expiry Alert',
      icon: Clock,
      color: 'var(--danger-500)',
      desc: 'Cảnh báo lô thuốc sắp hết hạn. Outbox pattern đảm bảo không gửi 2 lần cùng eventId.',
      fields: [
        { key: 'medicineId', label: 'Medicine ID (UUID)', type: 'text', placeholder: 'uuid...' },
        { key: 'medicineName', label: 'Tên thuốc', type: 'text', placeholder: 'Amoxicillin 250mg' },
        { key: 'branchId', label: 'Branch ID (UUID)', type: 'text', placeholder: 'uuid...' },
        { key: 'batchNo', label: 'Số lô', type: 'text', placeholder: 'LOT-2026-001' },
        { key: 'expiryDate', label: 'Ngày hết hạn', type: 'date' },
      ],
      handler: triggerExpiryAlertNotification,
    },
    {
      id: 'order-paid',
      label: 'Order Paid',
      icon: ShoppingCart,
      color: 'var(--accent-600)',
      desc: 'Thông báo đơn hàng đã thanh toán. Kiểm tra Outbox Pattern: gửi 2 lần cùng orderId → trả về "duplicate".',
      fields: [
        { key: 'orderId', label: 'Order ID (UUID)', type: 'text', placeholder: 'uuid...' },
        { key: 'orderNumber', label: 'Order Number', type: 'text', placeholder: 'ORD-2026-0001' },
        { key: 'customerId', label: 'Customer ID (UUID)', type: 'text', placeholder: 'uuid...' },
        { key: 'total', label: 'Tổng tiền (VND)', type: 'number', placeholder: '250000' },
      ],
      handler: triggerOrderPaidNotification,
    },
  ]

  async function handleTrigger(trigger) {
    setSending(true)
    try {
      const result = await trigger.handler(triggerForm)
      if (result?.status === 'duplicate') {
        toast.warning(`Outbox Pattern: Event đã được xử lý trước đó (eventId: ${result.eventId?.slice(0, 8)}…). Không gửi lại.`)
      } else {
        toast.success(`✅ Đã trigger "${trigger.label}" thành công! status=${result?.status}`)
      }
      setActiveTrigger(null)
      setTriggerForm({})
    } catch (e) { toast.error(getApiErrorMessage(e)) }
    finally { setSending(false) }
  }

  return (
    <div className="page-stack">
      {/* Outbox pattern explanation */}
      <div style={{
        padding: '16px', background: 'var(--info-50)', border: '1px solid var(--info-100)',
        borderRadius: 'var(--radius-md)',
      }}>
        <p style={{ margin: '0 0 8px', fontWeight: 700, color: 'var(--info-700)', fontSize: 14 }}>
          📦 Outbox Pattern — Đảm bảo đúng 1 lần gửi (At-least-once delivery)
        </p>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-600)' }}>
          Mỗi event được lưu vào <code>OutboxLog</code> table trước khi gửi. Nếu cùng <code>eventId</code> đến 2 lần, 
          hệ thống phát hiện duplicate và bỏ qua — không gửi thông báo 2 lần. 
          Thử nghiệm: gửi cùng <code>orderId</code> 2 lần → lần 2 nhận response <code>status=duplicate</code>.
        </p>
      </div>

      {/* Trigger cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {triggers.map(t => {
          const Icon = t.icon
          return (
            <div key={t.id} className="card" style={{ cursor: 'pointer', transition: 'box-shadow 150ms' }}
              onClick={() => { setActiveTrigger(t.id); setTriggerForm({}) }}>
              <div className="card-body">
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)',
                    background: t.color + '15',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={22} color={t.color} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--ink-900)', fontSize: 15 }}>{t.label}</p>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-500)', lineHeight: 1.5 }}>{t.desc}</p>
                <button className="btn btn-outline" type="button"
                  style={{ marginTop: 12, width: '100%', fontSize: 13 }}
                  onClick={e => { e.stopPropagation(); setActiveTrigger(t.id); setTriggerForm({}) }}>
                  <Zap size={14} /> Demo trigger
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Trigger form modal */}
      {activeTrigger && (() => {
        const trigger = triggers.find(t => t.id === activeTrigger)
        const Icon = trigger.icon
        return (
          <div role="dialog" aria-modal="true" aria-labelledby="trigger-form-title"
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(15,29,61,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24,
            }}
            onClick={e => e.target === e.currentTarget && setActiveTrigger(null)}>
            <div className="card" style={{ width: '100%', maxWidth: 480 }}>
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon size={20} color={trigger.color} />
                  <h2 className="card-title" id="trigger-form-title">Demo: {trigger.label}</h2>
                </div>
                <button className="btn btn-ghost btn-icon" type="button" onClick={() => setActiveTrigger(null)} aria-label="Đóng"><X size={18} /></button>
              </div>
              <div className="card-body" style={{ display: 'grid', gap: 14 }}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-500)' }}>{trigger.desc}</p>
                {trigger.fields.map(f => (
                  <div key={f.key} className="field">
                    <label className="field-label" htmlFor={`tf-${f.key}`}>{f.label}</label>
                    <input id={`tf-${f.key}`} type={f.type || 'text'} className="input"
                      placeholder={f.placeholder || ''} value={triggerForm[f.key] || ''}
                      onChange={e => setTriggerForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setActiveTrigger(null)}>Hủy</button>
                  <button type="button" className="btn btn-primary" disabled={sending}
                    onClick={() => handleTrigger(trigger)}>
                    <Send size={16} /> {sending ? 'Đang gửi...' : 'Gửi trigger'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function NotificationPage() {
  const [tab, setTab] = useState(TAB_INBOX)

  const tabs = [
    { id: TAB_INBOX, label: 'Hộp thư', icon: Bell },
    { id: TAB_COMPOSE, label: 'Soạn thông báo', icon: Megaphone },
    { id: TAB_OUTBOX, label: 'Demo Outbox', icon: Zap },
  ]

  return (
    <DashboardLayout>
      <div className="page-stack">
        {/* Header */}
        <header className="page-header">
          <div>
            <p className="page-kicker">Thông báo</p>
            <h1 className="page-title">Notifications</h1>
            <p className="page-description">
              Quản lý thông báo hệ thống. Hỗ trợ <strong>Outbox Pattern</strong>, <strong>@Async thread pool</strong>, 
              và <strong>MockSmsSender</strong> (log console thay vì gửi thật).
            </p>
          </div>
          <Bell size={40} color="var(--accent-600)" aria-hidden="true" />
        </header>

        {/* Tabs */}
        <div role="tablist" aria-label="Loại thông báo"
          style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--ink-200)' }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              id={`notif-tab-${id}`}
              type="button"
              onClick={() => setTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', background: 'none', border: 'none',
                borderBottom: tab === id ? '2px solid var(--accent-600)' : '2px solid transparent',
                marginBottom: -2,
                color: tab === id ? 'var(--accent-700)' : 'var(--ink-500)',
                fontWeight: tab === id ? 700 : 500,
                fontSize: 14, cursor: 'pointer', transition: 'all 150ms',
              }}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {/* Panels */}
        {tab === TAB_INBOX && <InboxTab />}
        {tab === TAB_COMPOSE && <ComposeTab />}
        {tab === TAB_OUTBOX && <OutboxTab />}
      </div>
    </DashboardLayout>
  )
}
