import { apiRequest, authHeader } from "../lib/apiClient";

/**
 * Ensure the backend always receives an object for DTO validation.
 */
function toSerializableConfigObject(configJson) {
  if (
    configJson &&
    typeof configJson === "object" &&
    !Array.isArray(configJson)
  ) {
    return configJson;
  }

  return { content: [] };
}

/**
 * Get saved builder JSON for selected project.
 */
export function getConfiguration(token, projectId) {
  return apiRequest(`/projects/${projectId}/configuration`, {
    headers: {
      ...authHeader(token),
    },
  });
}

/**
 * Save builder JSON for selected project.
 */
export function saveConfiguration(token, projectId, configJson) {
  const safeConfigJson = toSerializableConfigObject(configJson);

  return apiRequest(`/projects/${projectId}/configuration`, {
    method: "PUT",
    headers: {
      ...authHeader(token),
    },
    body: JSON.stringify({ configJson: safeConfigJson }),
  });
}

/**
 * Publish current draft configuration.
 */
export function publishConfiguration(token, projectId) {
  return apiRequest(`/projects/${projectId}/configuration/publish`, {
    method: "POST",
    headers: {
      ...authHeader(token),
    },
  });
}

/**
 * Get published configuration snapshot.
 */
export function getPublishedConfiguration(token, projectId) {
  return apiRequest(`/projects/${projectId}/configuration/published`, {
    headers: {
      ...authHeader(token),
    },
  });
}

/**
 * Get preview mock data for selected project.
 */
export function getPreviewMockData(token, projectId) {
  return apiRequest(`/projects/${projectId}/configuration/preview/mock-data`, {
    headers: {
      ...authHeader(token),
    },
  });
}
