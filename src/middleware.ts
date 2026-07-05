import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PREFIXES = [
  '/login', '/register', '/forgot-password',
  '/bai-viet', '/benh-thuong-gap', '/video', '/tra-cuu-thuoc',
  '/tra-cuu-duoc-chat', '/tra-cuu-duoc-lieu', '/tra-thuoc-chinh-hang',
  '/categories', '/he-thong-cua-hang', '/health-quiz',
  '/voucher', '/flash-sale', '/health-articles', '/danh-muc', '/suc-khoe',
  '/vaccines', '/medical-devices', '/orders',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') return NextResponse.next();

  const isPublic = PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
  if (isPublic) return NextResponse.next();

  const token = request.cookies.get('pcms_access_token')?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
