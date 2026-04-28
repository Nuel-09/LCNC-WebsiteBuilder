import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getToken() {
  const isBrowser = () => typeof window !== "undefined";

  if (!isBrowser()) {
    return null;
  }
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  return token;
}

/**
 * Ensure the backend always receives an object for DTO validation.
 */
export function toSerializableConfigObject(configJson) {
  if (
    configJson &&
    typeof configJson === "object" &&
    !Array.isArray(configJson)
  ) {
    return configJson;
  }

  return { content: [] };
}
