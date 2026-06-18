// =====================================================
// useServiceWorkerUpdate — detect when a new SW is waiting
// Triggers PWABadge toast so user can reload to update
// =====================================================

'use client';

import { useEffect, useState, useCallback } from 'react';

export function useServiceWorkerUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    // Listen for SW update events dispatched by next-pwa
    const handleSWUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ type: string }>;
      if (customEvent.detail?.type === 'onNeedRefresh') {
        setNeedRefresh(true);
      } else if (customEvent.detail?.type === 'onOfflineReady') {
        setOfflineReady(true);
        // Auto-hide after 5s
        setTimeout(() => setOfflineReady(false), 5000);
      }
    };

    window.addEventListener('sw-update-event' as any, handleSWUpdate);

    // Manual poll for SW update (fallback if next-pwa events not firing)
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
    }

    return () => {
      window.removeEventListener('sw-update-event' as any, handleSWUpdate);
    };
  }, []);

  const updateServiceWorker = useCallback(async (reload = true) => {
    if (!('serviceWorker' in navigator)) return;
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) return;
      // Tell the waiting SW to skip waiting and become active
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      setNeedRefresh(false);
      if (reload) {
        window.location.reload();
      }
    } catch (e) {
      console.error('SW update failed:', e);
    }
  }, []);

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
  };
}
