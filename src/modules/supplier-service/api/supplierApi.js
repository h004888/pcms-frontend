import { apiClient } from '@core/http/apiClient.js'

function compactParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '' && value !== null),
  )
}

export async function listSuppliers(params = {}) {
  const response = await apiClient.get('/suppliers', { params: compactParams(params) })
  return response.data
}

export async function getSupplierById(id) {
  const response = await apiClient.get(`/suppliers/${id}`)
  return response.data
}

export async function createSupplier(payload) {
  const response = await apiClient.post('/suppliers', payload)
  return response.data
}

export async function updateSupplier(id, payload) {
  const response = await apiClient.put(`/suppliers/${id}`, payload)
  return response.data
}

export async function getSupplierHistory(id) {
  const response = await apiClient.get(`/suppliers/${id}/history`)
  return response.data
}

export async function softDeleteSupplier(id) {
  const response = await apiClient.delete(`/suppliers/${id}`)
  return response.data
}
