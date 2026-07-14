import { apiClient } from '@core/http/apiClient.js'

export async function getShopHome() {
  const { data } = await apiClient.get('/shop/home')
  return data
}

export async function getFlashSales() {
  const { data } = await apiClient.get('/shop/flash-sales')
  return data
}

export async function searchProducts({ q, page = 0, size = 20 } = {}) {
  const { data } = await apiClient.get('/shop/search', { params: { q, page, size } })
  return data
}

export async function getProductDetail(id) {
  const { data } = await apiClient.get(`/shop/pdp/${id}`)
  return data
}

export async function getStores({ province, district, page = 0, size = 20 } = {}) {
  const { data } = await apiClient.get('/store/locator', { params: { province, district, page, size } })
  return data
}

export async function getMedicineReviews(medicineId) {
  const { data } = await apiClient.get('/reviews', { params: { medicineId } })
  return data
}

export async function getCategories() {
  const { data } = await apiClient.get('/categories')
  return data
}
