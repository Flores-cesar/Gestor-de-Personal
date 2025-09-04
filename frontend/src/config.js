export const API_URL =
  (typeof window !== "undefined" && window.__ENV && window.__ENV.API_URL)
    ? window.__ENV.API_URL
    : (import.meta.env.VITE_API_URL || "http://localhost:8000");