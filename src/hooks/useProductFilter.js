import { useMemo } from 'react'
import { useDebounce } from './useDebounce'

/**
 * Hook untuk filter & search produk
 * @param {Array} products - daftar semua produk
 * @param {{ search: string, categoryId: string }} filters
 * @returns {{ filtered: Array, total: number, isEmpty: boolean }}
 *
 * @example
 * const { filtered, total } = useProductFilter(products, { search, categoryId })
 */
export function useProductFilter(products, { search = '', categoryId = '' }) {
  const debouncedSearch = useDebounce(search, 250)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !debouncedSearch ||
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.barcode?.includes(debouncedSearch)

      const matchCategory = !categoryId || p.category_id === categoryId

      return matchSearch && matchCategory
    })
  }, [products, debouncedSearch, categoryId])

  return {
    filtered,
    total: products.length,
    isEmpty: filtered.length === 0,
  }
}
