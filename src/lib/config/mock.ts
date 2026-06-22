// =====================================================
// PCMS - Mock API config
// Khi NEXT_PUBLIC_USE_MOCK_API='true' hoặc chưa set, FE sẽ gọi
// Next.js route handlers (BFF) thay vì backend Java.
// =====================================================

export const USE_MOCK_API =
  process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || true; // default true khi chưa có backend

export const MOCK_API_DELAY_MS = 200;
