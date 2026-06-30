import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
};

// Subscription Core Operations Service
export const subscriptionService = {
  getAll: () => api.get("/subscription/all"),
  getById: (id) => api.get(`/subscription/${id}`),
  create: (data) => api.post("/subscription/add", data),
  update: (id, data) => api.put(`/subscription/${id}`, data),
  delete: (id) => api.delete(`/subscription/${id}`),

  getAnalytics: () => api.get("/subscription/stats"),

  getCategoryAnalytics: () => api.get("/subscription/category-analytics"),
};

export default api;
