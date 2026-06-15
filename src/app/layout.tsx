// =====================================================
// PCMS - Root Layout (wraps all pages with AuthProvider)
// =====================================================

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'vietnamese'], display: 'swap' });

export const metadata: Metadata = {
  title: 'PCMS - Hệ thống quản lý chuỗi nhà thuốc',
  description: 'Pharmacy Chain Management System - Hệ thống quản lý chuỗi nhà thuốc',
  keywords: ['PCMS', 'Pharmacy', 'Microservice', 'Spring Boot', 'Next.js'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.className}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
