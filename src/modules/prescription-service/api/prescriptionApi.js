import { apiClient } from '@core/http/apiClient.js'

function compactParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '' && value !== null),
  )
}

export async function listPrescriptions(params = {}) {
  const response = await apiClient.get('/prescriptions', { params: compactParams(params) })
  return response.data
}

export async function getPrescriptionById(id) {
  const response = await apiClient.get(`/prescriptions/${id}`)
  return response.data
}

export async function getPrescriptionByCode(code) {
  const response = await apiClient.get(`/prescriptions/code/${code}`)
  return response.data
}

export async function createPrescription(payload) {
  const response = await apiClient.post('/prescriptions', payload)
  return response.data
}

export async function savePrescriptionDraft(payload) {
  const response = await apiClient.post('/prescriptions/draft', payload)
  return response.data
}

export async function updatePrescription(id, payload) {
  const response = await apiClient.put(`/prescriptions/${id}`, payload)
  return response.data
}

export async function signPrescription(id) {
  const response = await apiClient.post(`/prescriptions/${id}/sign`)
  return response.data
}

export async function cancelPrescription(id) {
  const response = await apiClient.delete(`/prescriptions/${id}`)
  return response.data
}

export async function printPrescription(id) {
  const response = await apiClient.post(`/prescriptions/${id}/print`)
  return response.data
}
