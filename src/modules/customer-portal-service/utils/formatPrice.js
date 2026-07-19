export function formatPrice(price) {
  if (price == null) return ''
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}
