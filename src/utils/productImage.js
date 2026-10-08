import { API_BASE_URL } from '../api'

/**
 * URL gambar produk:
 * 1. image_url hasil upload (Supabase Storage, URL absolut)
 * 2. image_url lama yang relatif ("/uploads/...") -> diarahkan ke server backend
 * 3. gambar bawaan di public/image/<image>.png
 * @returns {string|null}
 */
export const getProductImage = (product) => {
  const url = product?.image_url
  if (url) {
    if (/^https?:\/\//.test(url)) return url
    return new URL(url, API_BASE_URL).href
  }
  if (product?.image) return `/image/${product.image}.png`
  return null
}
