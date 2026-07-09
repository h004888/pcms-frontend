import { apiClient } from '@core/http/apiClient.js'

function compactParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ''),
  )
}

export async function listInventoryBatches(params = {}) {
  const response = await apiClient.get('/inventory/batches', {
    params: compactParams(params),
  })

  return response.data
}

export async function getInventoryBatch(batchId) {
  const response = await apiClient.get(`/inventory/batches/${batchId}`)

  return response.data
}

export async function getBatchesByBranchAndMedicine(branchId, medicineId) {
  const response = await apiClient.get(
    `/inventory/branch/${branchId}/medicine/${medicineId}`,
  )

  return response.data
}

export async function listStockLevelReport(params = {}) {
  const response = await apiClient.get('/inventory/report/stock-level', {
    params: compactParams(params),
  })

  return response.data
}

export async function listMovementReport(params = {}) {
  const response = await apiClient.get('/inventory/report/movement', {
    params: compactParams(params),
  })

  return response.data
}

export async function listBatchTransactions(batchId) {
  const response = await apiClient.get('/inventory/transactions', {
    params: { batchId },
  })

  return response.data
}

export async function listLowStockAlerts() {
  const response = await apiClient.get('/inventory/alerts/low-stock')

  return response.data
}

export async function listExpiryAlerts(days = 30) {
  const response = await apiClient.get('/inventory/alerts/expiry', {
    params: { days },
  })

  return response.data
}

export async function importStock(payload) {
  const response = await apiClient.post('/inventory/import', payload)

  return response.data
}

export async function exportStock(payload) {
  const response = await apiClient.post('/inventory/export', payload)

  return response.data
}

export async function transferStock(payload) {
  const response = await apiClient.post('/inventory/transfer', payload)

  return response.data
}
