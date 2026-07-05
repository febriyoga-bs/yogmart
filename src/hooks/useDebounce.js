import { useState, useEffect } from 'react'

/**
 * Delay update nilai sampai pengguna berhenti mengetik
 * @param {any} value - nilai yang akan di-debounce
 * @param {number} delay - delay dalam ms (default: 300)
 * @returns {any} nilai yang sudah di-debounce
 *
 * @example
 * const debouncedSearch = useDebounce(search, 300)
 * // debouncedSearch hanya berubah setelah 300ms berhenti mengetik
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
