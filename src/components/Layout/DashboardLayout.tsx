// =====================================================
// PCMS - Dashboard Layout (Sidebar + Header + Content) — vivid edition
// Upgrades:
//   • Loading state có brand identity (PCMS pill logo + bar)
//   • Page header area dùng subtle gradient bg
// =====================================================

'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Pill } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!state.hydrated) return;
    if (!state.isAuthenticated) {
      router.push('/login');
    }
  }, [state.hydrated, state.isAuthenticated, router]);

  if (!state.hydrated) {
    return <DashboardLoading />;
  }

  if (!state.isAuthenticated) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-[--pcms-bg] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 overflow-x-auto bg-gradient-to-b from-transparent to-ink-50/30">
          {children}
        </main>
      </div>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
}

// Loading state có brand identity — không phải generic spinner
function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ink-50 via-white to-accent-50/30">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-ink-900 to-ink-800 rounded-xl mb-4 shadow-lg">
          <Pill className="w-7 h-7 text-accent-400" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-ink-900">PCMS</p>
        <div className="mt-3 w-32 h-1 bg-ink-100 rounded-full overflow-hidden">
          <div
            className="h-full w-1/3 bg-gradient-to-r from-accent-500 to-accent-700 rounded-full"
            style={{ animation: 'progressBar 1.5s ease-in-out infinite' }}
          />
        </div>
        <p className="mt-3 text-xs text-ink-500">Đang tải...</p>
        <style>{`
          @keyframes progressBar {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    </div>
  );
}
