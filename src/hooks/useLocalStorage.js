import { useState, useCallback } from 'react'

/**
 * useState yang disinkronkan dengan localStorage
 * @param {string} key - kunci localStorage
 * @param {any} initialValue - nilai awal jika key belum ada
 * @returns {[any, Function]} [value, setter]
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('app-theme', 'light')
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.warn(`useLocalStorage: gagal menyimpan key "${key}"`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}
