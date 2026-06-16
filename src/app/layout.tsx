// =====================================================
// PCMS - Root Layout (wraps all pages with AuthProvider)
// =====================================================

import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'vietnamese'], display: 'swap', variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin', 'vietnamese'], display: 'swap', variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'PCMS - Hệ thống quản lý chuỗi nhà thuốc',
  description: 'Pharmacy Chain Management System - Hệ thống quản lý chuỗi nhà thuốc',
  keywords: ['PCMS', 'Pharmacy', 'Microservice', 'Spring Boot', 'Next.js'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
