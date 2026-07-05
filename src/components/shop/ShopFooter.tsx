// =====================================================
// ShopFooter — Compact footer with legal links + hotline
// =====================================================

import Link from 'next/link';
import { Phone, ShieldCheck, Mail } from 'lucide-react';

export function ShopFooter() {
  return (
    <footer className="bg-ink-900 text-ink-300" aria-label="Chân trang">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid sm:grid-cols-3 gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent-400" aria-hidden="true" />
              <span className="text-sm font-bold text-white tracking-tight">PCMS</span>
            </div>
            <p className="text-xs leading-relaxed">
              Hệ thống quản lý chuỗi nhà thuốc — tra cứu thuốc, kê đơn, POS, tồn kho.
            </p>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-2">Chính sách</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/chinh-sach/giao-hang" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded">Chính sách giao hàng</Link></li>
              <li><Link href="/chinh-sach/doi-tra" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded">Chính sách đổi trả</Link></li>
              <li><Link href="/chinh-sach/bao-mat" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded">Chính sách bảo mật</Link></li>
              <li><Link href="/chinh-sach/tos" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-2">Liên hệ</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" aria-hidden="true" />
                <a href="tel:18006928" className="hover:text-white transition-colors font-mono">1800 6928</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" aria-hidden="true" />
                <a href="mailto:info@pcms.vn" className="hover:text-white transition-colors">info@pcms.vn</a>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" aria-hidden="true" />
                <span className="text-ink-400">Đã đăng ký Bộ Y tế</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-ink-800 text-[10px] text-ink-500 text-center">
          &copy; {new Date().getFullYear()} PCMS. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
