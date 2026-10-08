import { useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { productAPI } from '../api'
import { useToast } from '../contexts/ToastContext'
import { generateId } from '../utils/formatters'

/**
 * Simpan produk (tambah / edit) dari FormData ProductFormModal, lalu muat ulang daftar produk.
 * Dipakai di halaman Admin dan Scanner.
 * @returns {(formData: FormData) => Promise<boolean>} true kalau berhasil
 */
export function useSaveProduct() {
  const { loadProducts } = useOutletContext()
  const { showToast } = useToast()

  return useCallback(async (formData) => {
    try {
      const id = formData.get('id')

      if (id) {
        await productAPI.update(id, formData)
        showToast('Produk berhasil diupdate!')
      } else {
        // ID unik — "p-" + jumlah produk bisa bentrok kalau ada produk yang pernah dihapus
        formData.set('id', generateId('p'))
        await productAPI.create(formData)
        showToast('Produk berhasil ditambahkan!')
      }

      await loadProducts()
      return true
    } catch (err) {
      console.error(err)
      showToast(err.response?.data?.message || 'Gagal menyimpan produk', 'error')
      return false
    }
  }, [loadProducts, showToast])
}
