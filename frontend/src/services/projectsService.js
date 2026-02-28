import { apiRequest, authHeader } from '../lib/apiClient'

/**
 * Fetch all projects for current user.
 */
export function getProjects(token) {
  return apiRequest('/projects', {
    headers: {
      ...authHeader(token),
    },
  })
}

/**
 * Create a new project.
 */
export function createProject(token, payload) {
  return apiRequest('/projects', {
    method: 'POST',
    headers: {
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  })
}
