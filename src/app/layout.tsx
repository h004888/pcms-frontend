// =====================================================
// PCMS - Root Layout (wraps all pages with AuthProvider + PWA)
// =====================================================

import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
import { PWAProvider } from '@/components/shop/PWAProvider';
import { CartProvider } from '@/lib/shop/cart-context';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'vietnamese'], display: 'swap', variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin', 'vietnamese'], display: 'swap', variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'PCMS — Hệ thống quản lý chuỗi nhà thuốc',
    template: '%s | PCMS',
  },
  description: 'Hệ thống quản lý chuỗi nhà thuốc: tra cứu thuốc, kê đơn, POS, tồn kho, khách hàng thân thiết. Hỗ trợ dược sĩ làm việc nhanh và chính xác.',
  applicationName: 'PCMS',
  keywords: [
    'PCMS', 'pharmacy chain management', 'quản lý nhà thuốc',
    'tra cứu thuốc', 'kê đơn', 'POS dược phẩm', 'tồn kho',
  ],
  authors: [{ name: 'PCMS' }],
  creator: 'PCMS',
  publisher: 'PCMS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png' },
    ],
    shortcut: [
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PCMS',
    startupImage: [
      { url: '/icons/icon-512x512.png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    siteName: 'PCMS',
    title: 'PCMS — Hệ thống quản lý chuỗi nhà thuốc',
    description: 'Tra cứu thuốc, kê đơn, POS, tồn kho — đồng bộ toàn chuỗi.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PCMS — Hệ thống quản lý chuỗi nhà thuốc',
    description: 'Tra cứu thuốc, kê đơn, POS, tồn kho — đồng bộ toàn chuỗi.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f9fc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1d3d' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta charSet="utf-8" />
        {/* PWA primary meta tags (also in metadata) */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f1d3d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Long Châu" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* iOS splash screens (auto-resize for common devices) */}
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon-512x512.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
        />

        {/* Microsoft tiles */}
        <meta name="msapplication-TileColor" content="#0f1d3d" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />

        {/* Format detection — disable auto-linking */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <PWAProvider>
            <CartProvider>{children}</CartProvider>
          </PWAProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
