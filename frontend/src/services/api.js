import axios from "axios";

// Backend Target Endpoint
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Cookies (JWT) authorization header me bypass karne ke liye zaroori hai
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 HERE IS YOUR AUTH SERVICE: AuthContext ise hi dhoondh raha tha
export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
};

// Subscription Core Operations Service
export const subscriptionService = {
  getAll: () => api.get("/subscriptions"),
  getById: (id) => api.get(`/subscriptions/${id}`),
  create: (data) => api.post("/subscriptions", data),
  update: (id, data) => api.put(`/subscriptions/${id}`, data),
  delete: (id) => api.delete(`/subscriptions/${id}`),
  getAnalytics: () => api.get("/subscriptions/analytics"),
};

export default api;
