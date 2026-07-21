import { Store, Phone, MapPin, Clock, MapPinned } from 'lucide-react'

export function StoreCard({ store }) {
  const openMaps = () => {
    if (store.lat && store.lng) {
      window.open(`https://www.google.com/maps?q=${store.lat},${store.lng}`, '_blank')
    }
  }

  const callPhone = () => {
    if (store.phone) {
      window.open(`tel:${store.phone}`, '_blank')
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-[var(--shop-primary)] transition-all duration-200 flex gap-4">
      <div className="w-12 h-12 bg-[var(--shop-primary-light)] rounded-xl flex items-center justify-center shrink-0">
        <Store size={24} className="text-[var(--shop-primary)]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-bold text-[var(--shop-text)]">{store.code} - {store.name}</span>
          {(store.province || store.district) && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
              {[store.district, store.province].filter(Boolean).join(', ')}
            </span>
          )}
        </div>
        <div className="text-sm text-[var(--shop-text-secondary)] mb-2 flex items-center gap-1">
          <MapPinned size={14} className="shrink-0" />
          {store.address}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-sm text-[var(--shop-text-secondary)]">
          {store.phone && (
            <span className="flex items-center gap-1">
              <Phone size={14} /> {store.phone}
            </span>
          )}
          {store.openHours && (
            <span className="flex items-center gap-1">
              <Clock size={14} /> {store.openHours}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {store.lat && store.lng && (
            <button className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1" onClick={openMaps}>
              <MapPin size={14} />
              Xem bản đồ
            </button>
          )}
          {store.phone && (
            <button className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1" onClick={callPhone}>
              <Phone size={14} />
              Gọi
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
