import { BaseApi } from "./baseApi";

/**
 * Project service class that extends the BaseApi class.
 */
class ProjectService extends BaseApi {
  /**
   * Constructor for the AuthService class.
   * Calls the superclass constructor to initialize the AuthService instance.
   */
  constructor() {
    super();
  }

  /**
   * Retrieves all projects from the server.
   * @returns {Promise<object[]>} The response data containing the list of projects.
   */
  getProjects = async () => {
    try {
      const response = await this.instance.get("/projects");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Creates a new project with the provided payload.
   * @param {object} payload The payload containing project information.
   * @returns {Promise<object>} The response data from the server.
   */
  createProject = async (payload) => {
    try {
      const response = await this.instance.post("/projects", payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Updates an existing project with the provided payload.
   * @param {string} projectId The ID of the project to update.
   * @param {object} payload The payload containing the updated project information.
   * @returns {Promise<object>} The response data from the server.
   */
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

  /**
   * Deletes a project with the provided ID.
   * @param {string} projectId The ID of the project to delete.
   * @returns {Promise<object>} The response data from the server.
   */
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
