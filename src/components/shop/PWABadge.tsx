// =====================================================
// PWABadge — toast top-right when Service Worker has an update
// "Có bản cập nhật mới — tải lại để áp dụng" + [Tải lại] [Để sau]
// =====================================================

'use client';

import { RefreshCw, X } from 'lucide-react';
import { useServiceWorkerUpdate } from '@/hooks/shop/useServiceWorkerUpdate';

export function PWABadge() {
  const { needRefresh, offlineReady, updateServiceWorker } = useServiceWorkerUpdate();

  if (!needRefresh && !offlineReady) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 z-50 max-w-sm bg-white rounded-lg border border-ink-200 shadow-lg p-3 animate-in slide-in-from-right-4 duration-300"
      style={{ boxShadow: '0 4px 12px rgba(15, 29, 61, 0.12)' }}
    >
      {needRefresh && (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-accent-50 rounded-full flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-accent-700" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink-900">Có bản cập nhật mới</p>
            <p className="text-xs text-ink-500 mt-0.5">Tải lại để áp dụng phiên bản mới nhất</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => updateServiceWorker(true)}
                className="px-3 py-1.5 bg-ink-900 text-white text-xs font-medium rounded hover:bg-ink-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                Tải lại
              </button>
              <button
                onClick={() => updateServiceWorker(false)}
                className="px-3 py-1.5 text-ink-700 text-xs font-medium rounded hover:bg-ink-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}

      {offlineReady && !needRefresh && (
        <div className="flex items-center gap-2 text-sm text-ink-700">
          <div className="flex-shrink-0 w-2 h-2 bg-accent-500 rounded-full animate-pulse" aria-hidden="true" />
          <span className="font-medium">Sẵn sàng dùng offline</span>
        </div>
      )}
    </div>
  );
}
