import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, RefreshCcw, XCircle } from 'lucide-react'
import { ROUTES } from '@core/router/paths.js'
import { getPaymentStatus, cancelOrder } from '../api/shopApi'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/formatPrice'
import './PaymentPendingPage.css'

const BANK_NAME = 'MB Bank'
const ACCOUNT_NUMBER = '68061220049999'
const ACCOUNT_NAME = 'Nha thuoc PCMS'
const POLL_INTERVAL = 3000

export function PaymentPendingPage() {
  const { orderNumber } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const { total } = location.state || {}
  const [countdown, setCountdown] = useState(0)

  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ['payment-status', orderNumber],
    queryFn: () => getPaymentStatus(orderNumber),
    refetchInterval: POLL_INTERVAL,
    enabled: !!orderNumber,
  })

  useEffect(() => {
    if (data?.status === 'PAID') {
      clearCart()
      toast.success('Thanh toán thành công!')
      navigate(ROUTES.ORDER_SUCCESS(orderNumber), { replace: true })
    }
  }, [data?.status, navigate, orderNumber, clearCart])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev + 1) % 10)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const qrUrl = `https://img.vietqr.io/image/MB-${ACCOUNT_NUMBER}-compact2.png?amount=${total || 0}&addInfo=${orderNumber}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`

  return (
    <div className="payment-pending">
      <div className="payment-pending-header">
        <Loader2 size={40} className="payment-pending-spinner" />
        <h1 className="payment-pending-title">Đang chờ thanh toán</h1>
        <p className="payment-pending-sub">
          Quét mã QR bên dưới bằng ứng dụng ngân hàng để hoàn tất thanh toán
        </p>
      </div>

      <div className="payment-pending-qr-section">
        <img
          src={qrUrl}
          alt="VietQR thanh toán"
          className="payment-pending-qr"
        />
      </div>

      <div className="payment-pending-info">
        <div className="payment-pending-info-row">
          <span className="payment-pending-label">Ngân hàng</span>
          <span className="payment-pending-value">{BANK_NAME}</span>
        </div>
        <div className="payment-pending-info-row">
          <span className="payment-pending-label">Số tài khoản</span>
          <span className="payment-pending-value">{ACCOUNT_NUMBER}</span>
        </div>
        <div className="payment-pending-info-row">
          <span className="payment-pending-label">Số tiền</span>
          <span className="payment-pending-value payment-pending-amount">
            {formatPrice(total || 0)}
          </span>
        </div>
        <div className="payment-pending-info-row">
          <span className="payment-pending-label">Nội dung CK</span>
          <span className="payment-pending-value">{orderNumber}</span>
        </div>
      </div>

      <div className="payment-pending-status">
        {isLoading ? (
          <div className="payment-pending-waiting">
            <Loader2 size={16} className="payment-pending-spinner-sm" />
            <span>Đang kiểm tra trạng thái...</span>
          </div>
        ) : isError ? (
          <div className="payment-pending-error">
            <XCircle size={16} />
            <span>Lỗi kiểm tra trạng thái. Đang thử lại...</span>
          </div>
        ) : (
          <div className="payment-pending-waiting">
            <Loader2 size={16} className="payment-pending-spinner-sm" />
            <span>Đang chờ thanh toán... ({POLL_INTERVAL / 1000}s/lần)</span>
          </div>
        )}
      </div>

      <div className="payment-pending-actions">
        <button
          type="button"
          className="payment-pending-btn payment-pending-btn--primary"
          onClick={() => refetch()}
        >
          <RefreshCcw size={16} />
          Tôi đã chuyển khoản
        </button>
        <button
          type="button"
          className="payment-pending-btn payment-pending-btn--ghost"
          onClick={async () => {
            try {
              await cancelOrder(orderNumber)
              toast.info('Đã hủy thanh toán')
            } catch {
              toast.error('Không thể hủy thanh toán')
            }
            navigate(ROUTES.HOME, { replace: true })
          }}
        >
          <XCircle size={16} />
          Hủy thanh toán
        </button>
      </div>

      <p className="payment-pending-note">
        Đơn hàng <strong>{orderNumber}</strong> sẽ được xử lý ngay khi nhận được thanh toán.
      </p>
    </div>
  )
}
