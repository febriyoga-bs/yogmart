import axios from "axios";

// Base Client
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://yogmart-be.onrender.com/api",
  timeout: 30000,
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

// Products API
export const productAPI = {
  getAll: (params) => api.get("/products", { params }),

  getById: (id) => api.get(`/products/${id}`),

  getByBarcode: (barcode) => api.get(`/products/barcode/${barcode}`),

  create: (data) => api.post("/products", data),

  update: (id, data) => api.put(`/products/${id}`, data),

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