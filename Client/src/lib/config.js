export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const API_V1_URL = `${API_BASE_URL}/v1`;

export const FRONTEND_BASE_URL =
  import.meta.env.VITE_APP_URL || window.location.origin;
