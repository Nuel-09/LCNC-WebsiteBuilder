import { apiRequest, authHeader } from "../lib/apiClient";
import { BaseApi } from "./baseApi";

/**
 * Fetch all projects for current user.
 */
// export function getProjects(token) {
//   return apiRequest("/projects", {
//     headers: {
//       ...authHeader(token),
//     },
//   });
// }

// /**
//  * Create a new project.
//  */
// export function createProject(token, payload) {
//   return apiRequest("/projects", {
//     method: "POST",
//     headers: {
//       ...authHeader(token),
//     },
//     body: JSON.stringify(payload),
//   });
// }

// /**
//  * Update project metadata.
//  */
// export function updateProject(token, projectId, payload) {
//   return apiRequest(`/projects/${projectId}`, {
//     method: "PATCH",
//     headers: {
//       ...authHeader(token),
//     },
//     body: JSON.stringify(payload),
//   });
// }

// /**
//  * Delete a project.
//  */
// export function deleteProject(token, projectId) {
//   return apiRequest(`/projects/${projectId}`, {
//     method: "DELETE",
//     headers: {
//       ...authHeader(token),
//     },
//   });
// }

class ProjectService extends BaseApi {
  getProjects = async () => {
    try {
      const response = await this.instance.get("/projects");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  createProject = async (payload) => {
    try {
      const response = await this.instance.post("/projects", payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  updateProject = async (projectId, payload) => {
    try {
      const response = await this.instance.patch(
        `/projects/${projectId}`,
        payload,
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  deleteProject = async (projectId) => {
    try {
      const response = await this.instance.delete(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
}

const projectApi = new ProjectService();
export default projectApi;
