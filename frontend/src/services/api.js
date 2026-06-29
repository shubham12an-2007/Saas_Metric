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
  // 1. Backend me tumhara route '/all' hai
  getAll: () => api.get("/subscription/all"),

  getById: (id) => api.get(`/subscription/${id}`),

  // 2. Backend me tumhara route '/add' hai (Yeh pehle se chal raha tha)
  create: (data) => api.post("/subscription/add", data),

  update: (id, data) => api.put(`/subscription/${id}`, data),
  delete: (id) => api.delete(`/subscription/${id}`),

  // 3. Backend me tumhara route '/stats' hai
  getAnalytics: () => api.get("/subscription/stats"),
};
export default api;
