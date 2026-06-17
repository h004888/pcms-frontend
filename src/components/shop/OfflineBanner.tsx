// =====================================================
// OfflineBanner — shown at top when navigator.onLine === false
// Or briefly as "back online" toast when reconnected
// =====================================================

'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/shop/useOnlineStatus';

export function OfflineBanner() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    if (wasOffline && isOnline) {
      setShowBackOnline(true);
      const t = setTimeout(() => setShowBackOnline(false), 3000);
      return () => clearTimeout(t);
    }
  }, [wasOffline, isOnline]);

  if (isOnline && !showBackOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium shadow-sm animate-in slide-in-from-top-2 duration-300"
      style={{
        backgroundColor: isOnline ? '#0d7a72' : '#fef2f2',
        color: isOnline ? '#ffffff' : '#991b1b',
        borderBottom: isOnline ? 'none' : '1px solid #fecaca',
      }}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" aria-hidden="true" />
          <span>Đã kết nối lại internet</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" aria-hidden="true" />
          <span>
            Bạn đang <strong>offline</strong> — Một số tính năng có thể bị hạn chế. Đơn hàng vẫn được lưu và sẽ đồng bộ khi có mạng.
          </span>
        </>
      )}
    </div>
  );
}
