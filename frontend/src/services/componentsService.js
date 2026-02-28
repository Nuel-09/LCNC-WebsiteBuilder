import { apiRequest } from '../lib/apiClient'

/**
 * Get full component catalog for builder sidebar.
 */
export function getComponents() {
  return apiRequest('/components')
}

/**
 * Filter components by type.
 */
export function getComponentsByType(type) {
  return apiRequest(`/components/type/${encodeURIComponent(type)}`)
}

/**
 * Seed default components (dev/demo utility).
 */
export function seedComponents() {
  return apiRequest('/components/seed', {
    method: 'POST',
  })
}
