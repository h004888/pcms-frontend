// =====================================================
// PWAInstallPrompt — bottom-left banner encouraging Add to Home Screen
// Rules:
// - Show after 2+ visits (localStorage counter)
// - Dismiss-able, respects user's choice for 7 days
// - iOS: show instructions to "Share → Add to Home Screen" since iOS Safari
//   doesn't support beforeinstallprompt
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone, Share } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/shop/useInstallPrompt';

const STORAGE_KEY = 'pcms_pwa_install_dismissed';
const VISITS_KEY = 'pcms_visit_count';
const MIN_VISITS = 2;
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function PWAInstallPrompt() {
  const { canInstall, isInstalled, isIOS, isStandalone, promptInstall } = useInstallPrompt();
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Skip if already installed
    if (isInstalled || isStandalone) {
      setShowPrompt(false);
      return;
    }

    // Check if recently dismissed
    const lastDismissed = localStorage.getItem(STORAGE_KEY);
    if (lastDismissed) {
      const ts = parseInt(lastDismissed, 10);
      if (Date.now() - ts < DISMISS_DURATION_MS) {
        setDismissed(true);
        return;
      }
    }

    // Check visit count
    const visits = parseInt(localStorage.getItem(VISITS_KEY) || '0', 10) + 1;
    localStorage.setItem(VISITS_KEY, visits.toString());

    // Show after 2 visits if install is available
    if (visits >= MIN_VISITS) {
      if (canInstall || isIOS) {
        // Delay 5s so it doesn't show on first render
        const t = setTimeout(() => setShowPrompt(true), 5000);
        return () => clearTimeout(t);
      }
    }
  }, [canInstall, isInstalled, isIOS, isStandalone]);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSHelp(true);
      return;
    }
    const accepted = await promptInstall();
    if (accepted) {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSHelp(false);
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  if (dismissed || !showPrompt) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-desc"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-40 bg-white rounded-lg border border-ink-200 shadow-lg p-4 animate-in slide-in-from-bottom-4 duration-300"
      style={{ boxShadow: '0 4px 12px rgba(15, 29, 61, 0.12)' }}
    >
      <button
        onClick={handleDismiss}
        aria-label="Đóng"
        className="absolute top-2 right-2 p-1.5 text-ink-400 hover:text-ink-700 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-accent-700" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 id="pwa-install-title" className="text-sm font-semibold text-ink-900">
            Cài Long Châu lên màn hình chính
          </h3>
          <p id="pwa-install-desc" className="text-xs text-ink-500 mt-0.5">
            Truy cập nhanh + nhận thông báo nhắc uống thuốc
          </p>
        </div>
      </div>

      {!showIOSHelp ? (
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleInstall}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-ink-900 text-white text-sm font-medium rounded-md hover:bg-ink-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Cài đặt
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-ink-700 text-sm font-medium rounded-md hover:bg-ink-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            Để sau
          </button>
        </div>
      ) : (
        <div className="mt-3 p-3 bg-accent-50 rounded-md text-xs text-ink-700 space-y-2">
          <p className="font-semibold flex items-center gap-1.5">
            <Share className="w-3.5 h-3.5" aria-hidden="true" />
            Cài trên iPhone/iPad:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-ink-600">
            <li>Bấm nút <strong>Chia sẻ</strong> ở thanh công cụ Safari</li>
            <li>Chọn <strong>"Thêm vào màn hình chính"</strong></li>
            <li>Bấm <strong>Thêm</strong> ở góc trên phải</li>
          </ol>
        </div>
      )}
    </div>
  );
}
