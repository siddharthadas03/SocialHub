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
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${UPLOADS_BASE_URL}${path}`;
};

export default api;
