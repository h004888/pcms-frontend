import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import { CheckCheck, RefreshCcw } from 'lucide-react'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { getNotifications, markAllRead, markRead } from '../api/notificationApi.js'

dayjs.extend(relativeTime)
dayjs.locale('vi')

function getTypeInfo(template = '') {
  const t = template.toUpperCase()
  if (t.includes('LOW-STOCK') || t.includes('LOW_STOCK')) {
    return { color: '#ef4444', label: 'LOW STOCK ALERT', actionLabel: 'Đặt nhập hàng', actionPath: '/inventory/import' }
  }
  if (t.includes('EXPIRY')) {
    return { color: '#f59e0b', label: 'EXPIRY ALERT', actionLabel: 'Xem lô hàng', actionPath: '/inventory/alerts' }
  }
  if (t.includes('ORDER')) {
    return { color: 'var(--color-primary)', label: 'ORDER', actionLabel: null, actionPath: null }
  }
  return { color: 'var(--ink-300)', label: 'SYSTEM', actionLabel: null, actionPath: null }
}

function NotificationCard({ notification, onMarkRead, onAction }) {
  const { color, label, actionLabel, actionPath } = getTypeInfo(notification.template)
  const isRead = notification.status === 'READ'
  const relTime = dayjs(notification.createdAt).fromNow()

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 16,
        padding: '16px 20px',
        borderLeft: `4px solid ${color}`,
        border: `1px solid var(--ink-200)`,
        borderLeftWidth: 4,
        borderLeftColor: color,
        borderRadius: 8,
        background: isRead ? 'var(--ink-50)' : 'white',
        opacity: isRead ? 0.75 : 1,
        cursor: isRead ? 'default' : 'pointer',
      }}
      onClick={() => !isRead && onMarkRead(notification.id)}
    >
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 700, color, fontSize: 12, marginBottom: 4 }}>
          [{label}]
        </p>
        <p style={{ fontSize: 14, color: 'var(--ink-800)', lineHeight: 1.5 }}>
          {notification.body || notification.title}
        </p>
        {actionLabel && actionPath && (
          <button
            type="button"
            className="btn btn-outline"
            style={{ marginTop: 10, fontSize: 13 }}
            onClick={(e) => { e.stopPropagation(); onAction(actionPath) }}
          >
            {actionLabel}
          </button>
        )}
      </div>
      <span style={{ fontSize: 12, color: 'var(--ink-400)', whiteSpace: 'nowrap', paddingTop: 2 }}>
        {relTime}
      </span>
    </div>
  )
}

export function NotificationListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('pcms_user') || '{}') } catch { return {} }
  }, [])
  const recipientId = currentUser.id

  const query = useQuery({
    queryKey: ['notifications', recipientId],
    queryFn: () => getNotifications(recipientId),
    enabled: Boolean(recipientId),
  })

  const notifications = useMemo(
    () => query.data?.data || query.data?.content || [],
    [query.data],
  )

  const unreadCount = notifications.filter((n) => n.status !== 'READ').length

  const markReadMutation = useMutation({
    mutationFn: markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  const markAllMutation = useMutation({
    mutationFn: () => markAllRead(recipientId),
    onSuccess: () => {
      toast.success('Đã đánh dấu tất cả đã đọc.')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  })

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <span className="page-kicker">Hệ thống</span>
            <h1 className="page-title">Thông báo hệ thống</h1>
            {unreadCount > 0 && (
              <p className="page-description">{unreadCount} thông báo chưa đọc</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => query.refetch()}
            >
              <RefreshCcw size={16} aria-hidden="true" />
              Tải lại
            </button>
            <button
              type="button"
              className="btn btn-outline"
              disabled={unreadCount === 0 || markAllMutation.isPending}
              onClick={() => markAllMutation.mutate()}
            >
              <CheckCheck size={16} aria-hidden="true" />
              Đánh dấu tất cả đã đọc
            </button>
          </div>
        </header>

        {!recipientId ? (
          <div className="error-state" role="alert">
            Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.
          </div>
        ) : query.isLoading ? (
          <div className="empty-state">Đang tải thông báo...</div>
        ) : query.isError ? (
          <div className="error-state" role="alert">
            {getApiErrorMessage(query.error)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">Không có thông báo nào.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkRead={(id) => markReadMutation.mutate(id)}
                onAction={(path) => navigate(path)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
