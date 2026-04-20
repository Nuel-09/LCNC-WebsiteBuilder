import { createAiPlugin } from "@puckeditor/plugin-ai";
import "@puckeditor/plugin-ai/styles.css";
import baseApi from "./baseApi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3005";
// plugin-ai expects a full chat endpoint host in this setup.
const AI_HOST = import.meta.env.VITE_PUCK_AI_HOST ?? `${API_BASE_URL}/ai/chat`;

/**
 * Builder AI plugin factory.
 * Keep this thin adapter boundary so swapping AI providers later only touches this file.
 */
export function createBuilderAiPlugin({ projectId }) {
  const isAiEnabled = import.meta.env.VITE_ENABLE_PUCK_AI !== "false";
  if (!isAiEnabled || !projectId) {
    return null;
  }

  return createAiPlugin({
    host: AI_HOST,
    prepareRequest: async (opts = {}) => {
      // Normalize incoming headers (can be plain object or Headers instance)
      // and force Authorization so AI requests always pass JwtAuthGuard.
      const auth = {
        Authorization: baseApi.setAuthorization(),
      };
      let headers;
      if (auth.Authorization) {
        headers = { ...opts.headers, ...auth } ?? {};
        console.log(headers);
      }

      const body = {
        ...(opts.body ?? {}),
        projectId,
      };

      // Puck Cloud treats empty chatId as an invalid conversation id.
      // Remove it so a new chat session can be created server-side.
      if (!body.chatId) {
        delete body.chatId;
      }

      return {
        ...opts,
        headers,
        body,
        // Bearer token auth is enough; avoid credentialed mode to reduce CORS fragility.
        credentials: "same-origin",
      };
    },
  });
}
