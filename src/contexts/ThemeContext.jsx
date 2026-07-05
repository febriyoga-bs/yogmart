import { createContext, useContext } from 'react'
import { THEMES } from '../utils/constants'
import { useLocalStorage } from '../hooks/useLocalStorage'

// ─── Context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null)

// ─── Provider ────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }) {
  const [themeName, setTheme] = useLocalStorage('tk-theme', 'light')
  const theme = THEMES[themeName] ?? THEMES.light

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme harus digunakan di dalam <ThemeProvider>')
  return ctx
}
