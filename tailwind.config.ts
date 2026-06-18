import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        medical: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        // DESIGN.md seed: Full palette — Primary navy/indigo trầm, Accent teal.
        // Used by brand-led surfaces (login, splash, marketing). Authenticated
        // app pages will migrate gradually; existing primary/medical tokens
        // remain in place for now.
        ink: {
          50:  '#f1f3f9',
          100: '#e6e9f5',
          200: '#c5cce4',
          300: '#9aa3c8',
          400: '#6b75a8',
          500: '#475089',
          600: '#2f3870',
          700: '#1e2a5e',
          800: '#141d49',
          900: '#0f1d3d',
        },
        accent: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0d7a72',
          800: '#115e59',
          900: '#134e4a',
        },
        // ============================================================
        // STATUS PALETTE — tone y tế, không quá rực rỡ (AGENTS.md)
        // ============================================================
        // danger: cảnh báo, lỗi, hết hàng, hủy đơn. Tone đỏ-cam ấm
        // (tránh đỏ thuần của Tailwind default), bão hòa vừa đủ dùng trên
        // light surface, đủ tương phản WCAG AA trên bg-white.
        danger: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // success: hoàn tất, còn hàng, xác nhận. Tone xanh y tế
        // (medical green) — khớp `medical` có sẵn, dùng cho CTA confirm
        // và badge trạng thái tích cực.
        success: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // warning: sắp hết, cảnh báo liều, thuốc kê đơn. Tone amber ấm
        // (không vàng chanh), đủ nổi trên white nhưng không hú.
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // info: thông tin, gợi ý, hướng dẫn. Tone xanh dương dịu
        // (sky/cyan nhạt), tránh primary blue quá đậm.
        info: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [animate, typography],
};
export default config;
