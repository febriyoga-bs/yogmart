import { createContext, useContext, useLayoutEffect } from 'react'
import { THEMES } from '../utils/constants'
import { useLocalStorage } from '../hooks/useLocalStorage'

// ─── Context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null)

// ─── Provider ────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }) {
  const [themeName, setTheme] = useLocalStorage('tk-theme', 'light')
  const theme = THEMES[themeName] ?? THEMES.light

  // Expose warna tema sebagai CSS variable (--c-primary, --c-bg, ...) untuk styles/global.css
  useLayoutEffect(() => {
    const root = document.documentElement
    Object.entries(theme.colors).forEach(([key, value]) => root.style.setProperty(`--c-${key}`, value))
    root.style.colorScheme = theme.name === 'dark' ? 'dark' : 'light'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.colors.bgCard)
  }, [theme])

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
