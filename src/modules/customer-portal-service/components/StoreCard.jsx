import { Store, Phone, MapPin } from 'lucide-react'

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
    <div className="store-card">
      <div className="store-card-icon">
        <Store size={24} />
      </div>
      <div className="store-card-info">
        <div className="store-card-name">{store.code} - {store.name}</div>
        <div className="store-card-address">{store.address}</div>
        {store.phone && <div className="store-card-phone">☎ {store.phone}</div>}
        {store.openHours && <div className="store-card-hours">🕐 {store.openHours}</div>}
        <div className="store-card-actions">
          {store.lat && store.lng && (
            <button className="btn btn-outline" onClick={openMaps}>
              <MapPin size={14} aria-hidden="true" />
              Xem bản đồ
            </button>
          )}
          {store.phone && (
            <button className="btn btn-outline" onClick={callPhone}>
              <Phone size={14} aria-hidden="true" />
              Gọi
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
