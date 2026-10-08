import axios from "axios";

// Base Client
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://yogmart-be.onrender.com/api",
  // baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 30000,
});

export const TOKEN_KEY = "yogmart-token";
export const AUTH_LOGOUT_EVENT = "yogmart:logout";

// Request interceptor — sertakan token login
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Token invalid / kadaluarsa -> paksa logout (kecuali saat percobaan login itu sendiri)
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) => api.post("/auth/login", { username, password }),

  me: () => api.get("/auth/me"),
};

// Products API
export const productAPI = {
  getAll: (params) => api.get("/products", { params }),

  getById: (id) => api.get(`/products/${id}`),

  getByBarcode: (barcode) => api.get(`/products/barcode/${barcode}`),

  getLogs: (id) => api.get(`/products/${id}/logs`),

  create: (data) => api.post("/products", data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  update: (id, data) => api.put(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  delete: (id) => api.delete(`/products/${id}`),

  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append("image", file);

    return api.post(`/products/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Categories API
export const categoryAPI = {
  getAll: () => api.get("/categories"),

  getById: (id) => api.get(`/categories/${id}`),

  create: (data) => api.post("/categories", data),

  update: (id, data) => api.put(`/categories/${id}`, data),

  delete: (id) => api.delete(`/categories/${id}`),
};

// Stats API
export const statsAPI = {
  get: () => api.get("/stats"),
};

export default api;