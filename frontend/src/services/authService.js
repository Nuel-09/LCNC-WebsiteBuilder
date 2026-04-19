import { BaseApi } from "./baseApi";

/**
 * Authentication service class that extends the BaseApi class.
 */
class AuthService extends BaseApi {
  /**
   * Signs up a user with the provided payload.
   * @param {object} payload The payload containing user information.
   * @returns {Promise<object>} The response data from the server.
   */
  signup = async (payload) => {
    try {
      const response = await this.instance.post("/auth/signup", payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Logs in a user with the provided payload.
   * @param {object} payload The payload containing user login credentials.
   * @returns {Promise<object>} The response data from the server.
   */
  login = async (payload) => {
    try {
      const response = await this.instance.post("/auth/login", payload);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
}

const authApi = new AuthService();
export default authApi;
