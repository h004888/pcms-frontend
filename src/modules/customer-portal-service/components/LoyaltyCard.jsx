const tierColors = {
  BRONZE: '#CD7F32',
  SILVER: '#A8A9AD',
  GOLD: '#F59E0B',
}

const tierLabels = {
  BRONZE: 'Đồng',
  SILVER: 'Bạc',
  GOLD: 'Vàng',
}

export function LoyaltyCard({ code, points, tier }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex flex-wrap items-center gap-3">
        {code != null && (
          <span className="font-mono text-sm text-[var(--shop-text-secondary)]">
            Mã thành viên:{' '}
            <strong className="text-[var(--shop-text)]">{code}</strong>
          </span>
        )}
        {points != null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--shop-primary-light)] px-3 py-1 text-sm font-semibold text-[var(--shop-primary)]">
            ★ {points.toLocaleString('vi-VN')} điểm
          </span>
        )}
        {tier != null && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold"
            style={{
              backgroundColor: `${tierColors[tier]}15`,
              color: tierColors[tier],
              border: `1px solid ${tierColors[tier]}40`,
            }}
          >
            Hạng: {tierLabels[tier] || tier}
          </span>
        )}
      </div>
      {code == null && points == null && tier == null && (
        <p className="text-sm text-[var(--shop-text-secondary)]">Chưa có dữ liệu thành viên</p>
      )}
    </div>
  )
}
