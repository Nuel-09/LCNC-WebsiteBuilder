import { apiRequest, authHeader } from '../lib/apiClient'

/**
 * Get saved builder JSON for selected project.
 */
export function getConfiguration(token, projectId) {
  return apiRequest(`/projects/${projectId}/configuration`, {
    headers: {
      ...authHeader(token),
    },
  })
}

/**
 * Save builder JSON for selected project.
 */
export function saveConfiguration(token, projectId, configJson) {
  return apiRequest(`/projects/${projectId}/configuration`, {
    method: 'PUT',
    headers: {
      ...authHeader(token),
    },
    body: JSON.stringify({ configJson }),
  })
}

/**
 * Get preview mock data for selected project.
 */
export function getPreviewMockData(token, projectId) {
  return apiRequest(`/projects/${projectId}/configuration/preview/mock-data`, {
    headers: {
      ...authHeader(token),
    },
  })
}
