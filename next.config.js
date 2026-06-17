// @ts-check
const withPwa = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable SW in dev for hot reload
  publicExcludes: ['!noprecache/**'],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      urlPattern: /\/_next\/static\//i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      urlPattern: /\/api\/.*$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 5 },
        cacheableResponse: { statuses: [0, 200] },
        networkTimeoutSeconds: 5,
      },
    },
    {
      // B2C shop pages: NetworkFirst with cache fallback
      urlPattern: /^\/(?:$|shop|tra-cuu|he-thong-cua-hang|tiem-chung|login|profile|cart|checkout|orders|reminders|family|calendar|notifications|health|ai|consult|gioi-thieu|tin-tuc|tuyen-dung|chinh-sach)/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'shop-pages',
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
        cacheableResponse: { statuses: [0, 200] },
        networkTimeoutSeconds: 3,
      },
    },
  ],
  manifest: {
    name: 'Long Châu — Dược phẩm chính hãnh',
    short_name: 'Long Châu',
    description: 'Đặt thuốc theo toa, mua thuốc online, nhận nhắc uống thuốc. Giao hàng tận nơi toàn quốc.',
    theme_color: '#0f1d3d',
    background_color: '#f8f9fc',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    start_url: '/',
    lang: 'vi',
    dir: 'ltr',
    categories: ['health', 'medical', 'shopping', 'lifestyle'],
    display_override: ['window-controls-overlay', 'standalone', 'browser'],
    prefer_related_applications: false,
    background_color: '#ffffff',
    theme_color: '#0f1d3d',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Tìm thuốc',
        short_name: 'Tìm thuốc',
        description: 'Tra cứu thuốc nhanh chóng',
        url: '/tra-cuu-thuoc',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Giỏ hàng',
        short_name: 'Giỏ hàng',
        description: 'Xem giỏ hàng của bạn',
        url: '/cart',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Đặt thuốc theo toa',
        short_name: 'Đặt thuốc',
        description: 'Upload đơn thuốc để dược sĩ xác nhận',
        url: '/prescriptions/upload',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Nhắc uống thuốc',
        short_name: 'Nhắc thuốc',
        description: 'Quản lý lịch nhắc uống thuốc',
        url: '/reminders',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
};

module.exports = withPwa(nextConfig);

// Backward-compat redirects: old Long Châu-style URL slugs → new shorter slugs
module.exports = {
  ...module.exports,
  async redirects() {
    return [
      { source: '/chinh-sach/chinh-sach-giao-hang', destination: '/chinh-sach/giao-hang', permanent: true },
      { source: '/chinh-sach/chinh-sach-doi-tra', destination: '/chinh-sach/doi-tra', permanent: true },
      { source: '/chinh-sach/chinh-sach-bao-mat', destination: '/chinh-sach/bao-mat', permanent: true },
      { source: '/chinh-sach/chinh-sach-bao-mat-du-lieu-ca-nhan', destination: '/chinh-sach/bao-mat', permanent: true },
      { source: '/chinh-sach/chinh-sach-thanh-toan', destination: '/chinh-sach/tos', permanent: true },
      { source: '/chinh-sach/chinh-sach-noi-dung', destination: '/chinh-sach/tos', permanent: true },
      { source: '/chinh-sach/dieu-khoan-su-dung-long-chau-247', destination: '/chinh-sach/tos', permanent: true },
      { source: '/gioi-thieu/he-thong-cua-hang', destination: '/he-thong-cua-hang', permanent: true },
    ];
  },
};
