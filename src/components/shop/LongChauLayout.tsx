// =====================================================
// LongChauLayout — Header + Footer (Long Châu clone)
// Header/footer match fullpage-desktop.png (FPT Long Châu)
// Store locator now fetches from branch-service API.
// =====================================================

import { MapPin } from 'lucide-react';
import { LongChauHeaderClient } from './LongChauHeaderClient';

const FOOTER_LINKS = [
  {
    title: 'VỀ CHÚNG TÔI',
    items: ['Giới thiệu công ty', 'Hệ thống nhà thuốc', 'Điều pháp sự doanh', 'Hợp tác nhà cung cấp', 'Hợp tác chiến lược dài hạn', 'Cơ hội nghề nghiệp'],
  },
  {
    title: 'DANH MỤC',
    items: ['Thuốc người phơ', 'Tra thuốc', 'Tra cứu dược chất', 'Tra cứu dược liệu'],
  },
  {
    title: 'CHÍNH SÁCH',
    items: ['Đổi trả bảo hành', 'Vận chuyển & giao nhận', 'Bảo mật thông tin'],
  },
  {
    title: 'KẾT NỐI VỚI CHÚNG TÔI',
    items: ['Facebook', 'Tiktok', 'Shoppe', 'Lazada'],
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

interface Branch {
  name: string;
  address: string;
  phone: string;
  code: string;
}

async function getBranches(): Promise<Branch[]> {
  try {
    const res = await fetch(`${API_BASE}/branches?size=100`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export function LongChauHeader() {
  return <LongChauHeaderClient />;
}

export async function LongChauFooter() {
  const branches = await getBranches();

  return (
    <footer className="bg-white border-t border-slate-200">
      {/* Store locator section */}
      <section className="bg-gradient-to-b from-cyan-500 to-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <h3 className="text-lg md:text-xl font-extrabold flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Hệ thống nhà thuốc trên toàn quốc
            </h3>
            <button className="bg-white text-cyan-700 font-bold px-4 py-2 rounded-full text-sm whitespace-nowrap">
              Định danh cách mua thuốc
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-2 text-sm">
            {branches.length > 0 ? (
              branches.map((b) => (
                <a key={b.code} href={`/he-thong-cua-hang/${b.code}`} className="hover:text-yellow-300 truncate">
                  {b.name} - {b.address}
                </a>
              ))
            ) : (
              // Fallback: show static list if API unavailable
              [
                'Hệ thống nhà thuốc tại Hà Nội', 'Chi nhánh Hồ Chí Minh', 'Chi nhánh Đồng Nai',
                'Hệ thống nhà thuốc tại Hải Phòng', 'Chi nhánh Cần Thơ',
                'Chi nhánh Thái Nguyên', 'Chi nhánh Bình Dương', 'Chi nhánh Bắc Ninh',
                'Chi nhánh Long An', 'Chi nhánh Tiền Giang',
                'Chi nhánh Vĩnh Phúc', 'Chi nhánh Nghệ An', 'Chi nhánh Thanh Hóa',
                'Chi nhánh Hà Tĩnh', 'Chi nhánh Bình Phước',
                'Chi nhánh Đà Nẵng', 'Chi nhánh Hà Nam', 'Chi nhánh Bắc Giang',
                'Chi nhánh Vũng Tàu', 'Chi nhánh Nam Định',
                'Chi nhánh Thái Bình', 'Chi nhánh Hưng Yên', 'Chi nhánh Quảng Ninh',
                'Chi nhánh Khánh Hòa', 'Hệ thống nhà thuốc toàn quốc',
              ].map((s, i) => (
                <a key={i} href="#" className="hover:text-yellow-300 truncate">
                  {s}
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Main columns */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-5 gap-8 text-sm">
        {/* Logo + brand + app stores */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-blue-900 font-extrabold text-lg">
              L
            </div>
            <div className="leading-tight">
              <div className="text-[10px] font-bold tracking-wide text-slate-700">NHÀ THUỐC</div>
              <div className="text-sm font-extrabold tracking-wider text-slate-800">LONG CHÂU</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Hệ thống nhà thuốc Long Châu – đối tác chăm sóc sức khỏe tin cậy của bạn.
          </p>
          <div className="text-xs font-bold text-slate-700 mb-2">TẢI ỨNG DỤNG</div>
          <div className="flex flex-col gap-2">
            <button className="bg-black text-white text-xs px-3 py-2 rounded flex items-center gap-2 w-fit">
              <span>🍎</span>
              <span className="leading-tight">Tải từ <strong>App Store</strong></span>
            </button>
            <button className="bg-black text-white text-xs px-3 py-2 rounded flex items-center gap-2 w-fit">
              <span>▶</span>
              <span className="leading-tight">Tải từ <strong>Google Play</strong></span>
            </button>
          </div>
        </div>

        {/* Link columns */}
        {FOOTER_LINKS.map((g) => (
          <div key={g.title}>
            <h4 className="font-extrabold text-slate-800 mb-3">{g.title}</h4>
            <ul className="space-y-1.5 text-slate-600">
              {g.items.map((it) => (
                <li key={it} className="hover:text-cyan-600 cursor-pointer">{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Company info */}
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-xs text-slate-500 space-y-2">
          <div className="font-extrabold text-slate-800">WEBSITE CÔNG TY TNHH:</div>
          <p>CÔNG TY CỔ PHẦN DƯỢC PHẨM FPT LONG CHÂU – SỐ ĐKKD 0316275368 cấp ngày 11/08/2020 tại Sở KH & ĐT TP.HCM.</p>
          <p>Địa chỉ: 379/10/2 Lý Thường Kiệt, P.8, Q. Tân Bình, TP.HCM · Điện thoại: 028.73009668 · Email: longchau@fpt.com.vn</p>
          <p className="text-[11px]">
            © 2025 - 2026 Công ty CP Dược FPT Long Châu. Mã số doanh nghiệp 0316275368. Ngụy chỉ đăng ký nhãn hiệu sản phẩm FPT Long Châu.
          </p>
        </div>
      </div>
    </footer>
  );
}
