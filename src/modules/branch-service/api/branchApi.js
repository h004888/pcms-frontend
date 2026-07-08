import { apiClient } from '@core/http/apiClient.js'

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

export async function createBranch(payload) {
  const response = await apiClient.post('/branches', payload)

  return response.data
}

export async function updateBranch(branchId, payload) {
  const response = await apiClient.put(`/branches/${branchId}`, payload)

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
