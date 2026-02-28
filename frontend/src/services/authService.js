import { apiRequest } from '../lib/apiClient'

/**
 * Signup request.
 */
export function signup(payload) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * Login request.
 */
export function login(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
