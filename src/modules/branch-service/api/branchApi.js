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

export function getBranchImageUrl(branch) {
  if (!branch?.imageUrl) return ''
  const cacheKey = branch.updatedAt ? `?updatedAt=${encodeURIComponent(branch.updatedAt)}` : ''
  return `${API_BASE_URL}/branches/${branch.id}/image${cacheKey}`
}

export async function listBranches(params = {}) {
  const response = await apiClient.get('/branches', {
    params: {
      page: 0,
      size: 100,
      ...params,
    },
  })

  return response.data
}

export async function getBranch(branchId) {
  const response = await apiClient.get(`/branches/${branchId}`)

  return response.data
}

export async function getBranchStaff(branchId) {
  const response = await apiClient.get(`/branches/${branchId}/staff`)

  return response.data
}

export async function createBranch(payload, imageFile) {
  const response = await apiClient.post('/branches', toMultipartPayload(payload, imageFile), multipartConfig(imageFile))

  return response.data
}

export async function updateBranch(branchId, payload, imageFile) {
  const response = await apiClient.put(`/branches/${branchId}`, toMultipartPayload(payload, imageFile), multipartConfig(imageFile))

  return response.data
}

export async function assignBranchManager(branchId, managerId) {
  const response = await apiClient.put(`/branches/${branchId}/manager`, {
    managerId,
  })

  return response.data
}

export async function deactivateBranch(branchId) {
  await apiClient.delete(`/branches/${branchId}`)
}

export async function listBranchManagers(params = {}) {
  const response = await apiClient.get('/users', {
    params: {
      role: 'BRANCH_MANAGER',
      status: 'ACTIVE',
      page: 0,
      size: 100,
      ...params,
    },
  })

  return response.data
}

export async function getUser(userId) {
  const response = await apiClient.get(`/users/${userId}`)

  return response.data
}
