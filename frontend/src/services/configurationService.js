import { toSerializableConfigObject } from "@/lib/utils";
import { BaseApi } from "./baseApi";

/**
 * Configuration service class that extends the BaseApi class.
 */
class ConfigurationService extends BaseApi {
  /**
   * Constructor for ConfigurationService.
   * Calls super() to initialize BaseApi.
   */
  constructor() {
    super();
  }

  /**
   * Retrieves the configuration for a project with the provided ID.
   * @param {string} projectId The ID of the project.
   * @returns {Promise<object>} The response data containing the configuration.
   */
  getConfiguration = async (projectId) => {
    try {
      const response = await this.instance.get(
        `/projects/${projectId}/configuration`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Saves the configuration for a project with the provided ID.
   * @param {string} projectId The ID of the project.
   * @param {object} configJson The configuration object to save.
   * @returns {Promise<object>} The response data from the server.
   */
  saveConfiguration = async (projectId, configJson) => {
    try {
      const safeConfigJson = toSerializableConfigObject(configJson);
      const response = await this.instance.put(
        `/projects/${projectId}/configuration`,
        { configJson: safeConfigJson },
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Publishes the configuration for a project with the provided ID.
   * @param {string} projectId The ID of the project.
   * @returns {Promise<object>} The response data from the server.
   */
  publishConfiguration = async (projectId) => {
    try {
      const response = await this.instance.post(
        `/projects/${projectId}/configuration/publish`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Retrieves the published configuration for a project with the provided ID.
   * @param {string} projectId The ID of the project.
   * @returns {Promise<object>} The response data containing the published configuration.
   */
  getPublishedConfiguration = async (projectId) => {
    try {
      const response = await this.instance.get(
        `/projects/${projectId}/configuration/published`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Retrieves the public live site configuration for a published project.
   */
  getPublicPublishedConfiguration = async (projectId) => {
    try {
      const response = await this.instance.get(
        `/public/projects/${projectId}/published`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Retrieves the preview mock data for a project with the provided ID.
   * @param {string} projectId The ID of the project.
   * @returns {Promise<object>} The response data containing the preview mock data.
   */
  getPreviewMockData = async (projectId) => {
    try {
      const response = await this.instance.get(
        `/projects/${projectId}/configuration/preview/mock-data`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
}

const configurationApi = new ConfigurationService();
export default configurationApi;
