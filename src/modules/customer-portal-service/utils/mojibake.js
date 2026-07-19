// ═══════════════════════════════════════════════════════════════════════
//   MOJIBAKE FIX UTILITY
//   ──────────────────────────────────────────────────────────────────────
//   TODO(BE-2026-07): REMOVE THIS FILE khi backend fix xong DB collation.
//
//   Bối cảnh: Backend hiện đang trả về chuỗi bị mojibake do:
//     1. JDBC connection KHÔNG set useUnicode=true&characterEncoding=UTF-8
//     2. MySQL column collation = latin1 (nhưng bytes thực tế đã là UTF-8)
//
//   Kết quả: byte UTF-8 (vd 0xC3 0xAF cho "ị") bị JDBC đọc theo latin1
//   thành 2 ký tự "├╣" hiển thị mojibake trên FE.
//
//   Cách shim này recover lại UTF-8 bằng cách:
//     - Lấy latin1 bytes từ chuỗi hỏng
//     - Decode các bytes đó như UTF-8
//     → Kết quả: chuỗi tiếng Việt có dấu đúng.
//
//   Đã có file docs/requests/2026-07-18-pcms-backend-utf8mb4-fix.md gửi
//   team Java backend yêu cầu ALTER TABLE utf8mb4 + sửa connection string.
//   Khi BE confirm xong, REMOVE toàn bộ file này + walkJsonDecoder() trong shopApi.js.
// ═══════════════════════════════════════════════════════════════════════

const MOJIBAKE_MARK = /[\u2500-\u257F\u2550-\u259F\u0080-\u009F]/
// Box-drawing (─, │, ═, ║) + control chars (0x80-0x9F latin1) thường chỉ xuất hiện
// khi UTF-8 bytes bị đọc sai thành latin1 "extended" chars. Nếu chuỗi thuần ASCII
// thì không có char nào trong set này.

/**
 * Decode latin1-as-utf8 mojibake back to original UTF-8 string.
 *
 * Algorithm:
 *   1. Lấy từng char code của chuỗi (0-65535), mask 0xFF để ra latin1 byte.
 *   2. Thử decode các byte này như UTF-8.
 *      - Nếu hợp lệ UTF-8 → trả về chuỗi UTF-8 đã recover.
 *      - Nếu không hợp lệ (vì data thực sự là latin1, không phải UTF-8) → trả nguyên.
 *
 * Returns the original string if it doesn't look like mojibake (no box-drawing / control char).
 */
export function fixMojibake(s) {
  if (typeof s !== 'string' || s.length === 0) return s
  // Heuristic: nếu không có box-drawing / control char → không phải mojibake
  if (!MOJIBAKE_MARK.test(s)) return s
  try {
    const bytes = new Uint8Array(s.length)
    for (let i = 0; i < s.length; i++) {
      bytes[i] = s.charCodeAt(i) & 0xFF
    }
    const fixed = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return fixed
  } catch {
    return s
  }
}

/**
 * Walk một object, áp dụng fixMojibake cho tất cả string ở mọi cấp.
 * Mutates input (an toàn vì API response là object mới từ axios).
 */
export function decodeMojibakeDeep(value) {
  if (value == null) return value
  if (typeof value === 'string') return fixMojibake(value)
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i] = decodeMojibakeDeep(value[i])
    }
    return value
  }
  if (typeof value === 'object') {
    for (const key of Object.keys(value)) {
      value[key] = decodeMojibakeDeep(value[key])
    }
    return value
  }
  return value
}

/**
 * Một số string bị mojibake nặng đến mức bytes không còn khôi phục được
 * thành UTF-8 hợp lệ (vd bytes đã bị lệch quá nhiều lần qua các layer
 * encoding khác nhau). Trong trường hợp đó, fixMojibake trả nguyên chuỗi
 * gốc — và chuỗi gốc vẫn có box-drawing/control chars.
 *
 * Hàm này giúp component phát hiện "không recover được" để quyết định:
 *   - Ẩn hoàn toàn
 *   - Dùng fallback string
 *   - Hoặc render nguyên (xấu nhưng có data)
 */
export function isUnrecoverableMojibake(s) {
  return typeof s === 'string'
    && s.length > 0
    && MOJIBAKE_MARK.test(s)
    && fixMojibake(s) === s
}
