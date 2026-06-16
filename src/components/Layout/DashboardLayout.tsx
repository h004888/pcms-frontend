// =====================================================
// PCMS - Dashboard Layout (Sidebar + Header + Content)
// Used by all authenticated pages
// =====================================================

'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LoadingSpinner } from '@/components/ui/Feedback';
import { Toaster } from 'react-hot-toast';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { state } = useAuth();
  const router = useRouter();

  // Auth guard: redirect to /login if not authenticated
  useEffect(() => {
    // Wait for hydration before checking (avoid SSR mismatch)
    if (typeof window === 'undefined') return;
    if (!state.isAuthenticated) {
      router.push('/login');
    }
  }, [state.isAuthenticated, router]);

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--pcms-bg] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-x-auto">
          {children}
        </main>
      </div>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
}
