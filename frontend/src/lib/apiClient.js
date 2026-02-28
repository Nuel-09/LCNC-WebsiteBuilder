// Base URL for backend API.
// You can override this by creating frontend/.env with:
// VITE_API_BASE_URL=http://localhost:3000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

/**
 * Small wrapper around fetch for consistent JSON handling.
 */
export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  // Try JSON first; fallback to text when no JSON payload is returned.
  const rawBody = await response.text()
  const data = rawBody ? safeJsonParse(rawBody) : null

  if (!response.ok) {
    const message =
      data?.message ?? data?.error ?? `Request failed with status ${response.status}`
    throw new Error(Array.isArray(message) ? message.join(', ') : message)
  }

  return data
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value)
  } catch {
    return { message: value }
  }
}

/**
 * Create Authorization header from JWT token.
 */
export function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}
