import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3005";

/**
 * Base API class for making HTTP requests using Axios.
 */

export class BaseApi {
  /**
   * The Axios instance used for making requests.
   * @type {AxiosInstance}
   */
  instance = null;

  /**
   * Creates an instance of the BaseApi class.
   */
  constructor() {
    this.instance = this.createInstance();
  }

  /**
   * Creates and configures the Axios instance.
   * @returns {AxiosInstance} The configured Axios instance.
   */
  createInstance = () => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 50000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    instance.interceptors.request.use(this.config, (error) => {
      console.error("Error while making a request", error);
      return Promise.reject(error);
    });

    instance.interceptors.response.use((response) => {
      return response;
    }, this.configError);

    return instance;
  };

  /**
   * Sets the Authorization header for the Axios instance based on the user token.
   * @returns {string|null} The Authorization header value or null if no token is found.
   */
  setAuthorization = () => {
    const isBrowser = () => typeof window !== "undefined";

    if (!isBrowser()) {
      return null;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    return `Bearer ${token}`;
  };

  /**
   * Configures the request configuration object with the Authorization header if a token is present.
   * @param {object} config The request configuration object.
   * @returns {object} The modified request configuration object.
   */
  config = (config) => {
    const altCopy = config;
    const userToken = this.setAuthorization();
    if (userToken) {
      altCopy.headers.Authorization = userToken;
    }
    return altCopy;
  };

  /**
   * Handles errors that occur during the response phase.
   * @param {object} error The error object.
   * @returns {Promise} A rejected Promise with the error object.
   */
  configError = (error) => {
    if (error.response?.status === 401) {
      this.clearSession();
      this.clearHeader();
      window.location.href = "/?error=expired";
      return Promise.reject(error);
    }

    if (!error.response) {
      return Promise.reject("Network Error, Try Again" + error);
    }

    console.error("Error while receiving a response", error);
    console.dir(error);
    toast.error(
      error?.response?.data?.message[0] ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
    );

    return Promise.reject(error);
  };

  /**
   * Clears the Authorization header from the Axios instance.
   */
  clearHeader = () => {
    delete this.instance.defaults.headers.common.Authorization;
  };

  /**
   * Clears the token, user, and selectedProjectId from local storage.
   */
  clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedProjectId");
  };
}

const baseApi = new BaseApi();
export default baseApi;
