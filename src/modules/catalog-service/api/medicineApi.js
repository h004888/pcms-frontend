import { apiClient } from '@core/http/apiClient.js'

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

export async function createMedicine(payload) {
  const response = await apiClient.post('/medicines', payload)

  return response.data
}

export async function updateMedicine(medicineId, payload) {
  const response = await apiClient.put(`/medicines/${medicineId}`, payload)

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
