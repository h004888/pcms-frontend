// =====================================================
// PWAProvider — global PWA wrapper
// Mounts once in root layout, renders 3 persistent UI:
// 1. PWAInstallPrompt (bottom-left banner, after 2 visits)
// 2. OfflineBanner (top sticky when offline)
// 3. PWABadge (toast top-right when SW has update)
// =====================================================

'use client';

import { ReactNode } from 'react';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { OfflineBanner } from './OfflineBanner';
import { PWABadge } from './PWABadge';

export function PWAProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <OfflineBanner />
      <PWAInstallPrompt />
      <PWABadge />
    </>
  );
}
