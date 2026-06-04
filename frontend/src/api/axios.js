import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const DEFAULT_UPLOADS_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");
export const UPLOADS_BASE_URL =
  import.meta.env.VITE_UPLOADS_URL || DEFAULT_UPLOADS_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("socialhub_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const assetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("data:")) return path;

  try {
    const url = new URL(path);
    const hostname = url.hostname.toLowerCase();
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

    if (isLocalhost && url.pathname.startsWith("/uploads")) {
      return `${UPLOADS_BASE_URL}${url.pathname}${url.search}${url.hash}`;
    }

    return path;
  } catch (error) {
    // Not an absolute URL, continue to normalize relative paths
  }

  if (path.startsWith("/uploads")) {
    return `${UPLOADS_BASE_URL}${path}`;
  }

  return `${UPLOADS_BASE_URL}/${path.replace(/^\/+/, "")}`;
};

export default api;
