import { useEffect, useState } from 'react'

/**
 * true kalau media query cocok, ikut berubah saat layar di-resize / diputar
 * @param {string} query - mis. '(max-width: 767px)'
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Breakpoint mobile — sama dengan media query di styles/global.css */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
