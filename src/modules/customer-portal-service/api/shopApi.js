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

export const getCustomerOrders = wrap(async ({ status, dateFrom, dateTo, page = 0, size = 20 } = {}) => {
  const params = { status, dateFrom, dateTo, page, size }
  Object.keys(params).forEach((key) => {
    if (params[key] === undefined || params[key] === '') delete params[key]
  })
  const { data } = await apiClient.get('/orders/history', { params })
  return data
})

export const getCustomerOrderDetail = wrap(async (id) => {
  const { data } = await apiClient.get(`/orders/${id}/detail`)
  return data
})

export const getCustomerOrderTracking = wrap(async (id) => {
  const { data } = await apiClient.get(`/orders/${id}/track`)
  return data
})

export const getCustomerProfile = wrap(async () => {
  const { data } = await apiClient.get('/customers/me')
  return data
})

export const updateCustomerProfile = wrap(async (payload) => {
  const { data } = await apiClient.put('/customers/me', payload)
  return data
})

export const listAddresses = wrap(async () => {
  const { data } = await apiClient.get('/addresses')
  return data
})

export const createAddress = wrap(async (payload) => {
  const { data } = await apiClient.post('/addresses', payload)
  return data
})

export const updateAddress = wrap(async (id, payload) => {
  const { data } = await apiClient.put(`/addresses/${id}`, payload)
  return data
})

export const deleteAddress = wrap(async (id) => {
  await apiClient.delete(`/addresses/${id}`)
})

export const setDefaultAddress = wrap(async (id) => {
  const { data } = await apiClient.put(`/addresses/${id}/default`)
  return data
})

export const listFamilyMembers = wrap(async () => {
  const { data } = await apiClient.get('/family')
  return data
})

export const getFamilyMember = wrap(async (id) => {
  const { data } = await apiClient.get(`/family/${id}`)
  return data
})

export const createFamilyMember = wrap(async (payload) => {
  const { data } = await apiClient.post('/family', payload)
  return data
})

export const updateFamilyMember = wrap(async (id, payload) => {
  const { data } = await apiClient.put(`/family/${id}`, payload)
  return data
})

export const deleteFamilyMember = wrap(async (id) => {
  await apiClient.delete(`/family/${id}`)
})

export const getNotificationSettings = wrap(async () => {
  const { data } = await apiClient.get('/notif-settings')
  return data
})

export const updateNotificationSettings = wrap(async (payload) => {
  const { data } = await apiClient.put('/notif-settings', payload)
  return data
})

export const previewCheckout = wrap(async (payload) => {
  const { data } = await apiClient.post('/cart/checkout/preview', payload)
  return data
})

export const confirmCheckout = wrap(async (payload) => {
  const { data } = await apiClient.post('/cart/checkout/confirm', payload)
  return data
})

export const addCartItem = wrap(async (payload) => {
  const { data } = await apiClient.post('/cart/items', payload)
  return data
})

export const updateCartItem = wrap(async (itemId, payload) => {
  const { data } = await apiClient.put(`/cart/items/${itemId}`, payload)
  return data
})

export const removeCartItem = wrap(async (itemId) => {
  const { data } = await apiClient.delete(`/cart/items/${itemId}`)
  return data
})

export const getBackendCart = wrap(async () => {
  const { data } = await apiClient.get('/cart')
  return data
})

export const clearBackendCart = wrap(async () => {
  await apiClient.delete('/cart')
})

export const getOrderByNumber = wrap(async (orderNumber) => {
  const { data } = await apiClient.get(`/orders/number/${orderNumber}`)
  return data
})
