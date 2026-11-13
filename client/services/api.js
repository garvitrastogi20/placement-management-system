import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "") ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT Token to every request
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
