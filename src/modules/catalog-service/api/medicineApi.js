import { API_BASE_URL, apiClient } from '@core/http/apiClient.js'

function toMultipartPayload(payload, imageFile) {
  if (!imageFile) return payload

  const formData = new FormData()
  formData.append('payload', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  formData.append('image', imageFile)
  return formData
}

function multipartConfig(imageFile) {
  return imageFile ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
}

export function getMedicineImageUrl(medicine) {
  const imageUrl = medicine?.imageUrl?.trim()
  if (!imageUrl) return ''
  if (/^(https?:|data:|blob:)/i.test(imageUrl)) return imageUrl

  const cacheKey = medicine.updatedAt ? `?updatedAt=${encodeURIComponent(medicine.updatedAt)}` : ''
  return `${API_BASE_URL}/medicines/${medicine.id}/image${cacheKey}`
}

export async function listMedicines(params = {}) {
  const response = await apiClient.get('/medicines', {
    params: {
      page: 0,
      size: 100,
      ...params,
    },
  })

  return response.data
}

export async function getMedicine(medicineId) {
  const response = await apiClient.get(`/medicines/${medicineId}`)

  return response.data
}

export async function createMedicine(payload, imageFile) {
  const response = await apiClient.post(
    '/medicines',
    toMultipartPayload(payload, imageFile),
    multipartConfig(imageFile),
  )

  return response.data
}

export async function updateMedicine(medicineId, payload, imageFile) {
  const response = await apiClient.put(
    `/medicines/${medicineId}`,
    toMultipartPayload(payload, imageFile),
    multipartConfig(imageFile),
  )

  return response.data
}

export async function deactivateMedicine(medicineId) {
  await apiClient.delete(`/medicines/${medicineId}`)
}

export async function listCategories(params = {}) {
  const response = await apiClient.get('/categories', {
    params: {
      page: 0,
      size: 100,
      ...params,
    },
  })

  return response.data
}

export async function listSuppliers(params = {}) {
  const response = await apiClient.get('/suppliers', {
    params: {
      page: 0,
      size: 100,
      ...params,
    },
  })

  return response.data
}
