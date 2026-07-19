import { apiClient } from '@core/http/apiClient.js'
// TODO(BE-2026-07): REMOVE this import khi backend fix xong DB collation.
// Hiện backend trả về mojibake vì JDBC charset=latin1 + column collation=latin1.
// File docs/requests/2026-07-18-pcms-backend-utf8mb4-fix.md đã gửi team Java.
import { decodeMojibakeDeep } from '../utils/mojibake.js'

// Wrap response interceptor: axios resolves with response.data, so wrap each
// public API to apply decodeMojibakeDeep to the parsed body.
// TODO(BE-2026-07): Remove this wrapper once backend returns proper UTF-8.
function wrap(getter) {
  return async (...args) => decodeMojibakeDeep(await getter(...args))
}

export const getShopHome = wrap(async () => {
  const { data } = await apiClient.get('/shop/home')
  return data
})

export const getFlashSales = wrap(async () => {
  const { data } = await apiClient.get('/shop/flash-sales')
  return data
})

export const searchProducts = wrap(async ({ q, category, page = 0, size = 20, sort } = {}) => {
  const { data } = await apiClient.get('/shop/search', { params: { q, category, page, size, sort } })
  return data
})

export const getProductDetailBySlug = wrap(async (slug) => {
  const { data } = await apiClient.get(`/shop/pdp/slug/${slug}`)
  return data
})

export const getProductDetailById = wrap(async (id) => {
  const { data } = await apiClient.get(`/shop/pdp/${id}`)
  return data
})

export const getStores = wrap(async ({ province, district, page = 0, size = 20 } = {}) => {
  const { data } = await apiClient.get('/store/locator', { params: { province, district, page, size } })
  return data
})

export const getMedicineReviews = wrap(async (medicineId) => {
  const { data } = await apiClient.get('/reviews', { params: { medicineId } })
  return data
})

export const getCategories = wrap(async () => {
  const { data } = await apiClient.get('/categories')
  return data
})

export const getCustomerOrders = wrap(async ({ page = 0, size = 20 } = {}) => {
  const { data } = await apiClient.get('/orders', { params: { page, size } })
  return data
})
