import axios from 'axios'

// ─── Base Client ──────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: '/api',
  timeout: 30_000,
})

// Response interceptor — unwrap data
api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
)

// ─── Products API ─────────────────────────────────────────────────────────────
export const productAPI = {
  /** @param {{ search?: string, category?: string }} params */
  getAll:       (params) => api.get('/products', { params }),
  getById:      (id)     => api.get(`/products/${id}`),
  getByBarcode: (barcode) => api.get(`/products/barcode/${barcode}`),
  create:       (data)   => api.post('/products', data),
  update:       (id, data) => api.put(`/products/${id}`, data),
  delete:       (id)     => api.delete(`/products/${id}`),

  /** Upload gambar produk */
  uploadImage: (id, file) => {
    const form = new FormData()
    form.append('image', file)
    return api.post(`/products/${id}/image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// ─── Categories API ───────────────────────────────────────────────────────────
export const categoryAPI = {
  getAll:  ()         => api.get('/categories'),
  create:  (data)     => api.post('/categories', data),
  update:  (id, data) => api.put(`/categories/${id}`, data),
  delete:  (id)       => api.delete(`/categories/${id}`),
}

// ─── Stats API ────────────────────────────────────────────────────────────────
export const statsAPI = {
  get: () => api.get('/stats'),
}

export default api
