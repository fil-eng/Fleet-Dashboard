import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // backend

const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach JWT if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
