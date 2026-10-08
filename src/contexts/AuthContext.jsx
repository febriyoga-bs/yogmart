import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI, TOKEN_KEY, AUTH_LOGOUT_EVENT } from '../api'

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // true selama token tersimpan sedang diverifikasi ke server
  const [checking, setChecking] = useState(() => !!localStorage.getItem(TOKEN_KEY))

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const login = useCallback(async (username, password) => {
    const { token, user } = await authAPI.login(username, password)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(user)
    return user
  }, [])

  // Pulihkan sesi dari token yang tersimpan
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return
    authAPI.me()
      .then(setUser)
      .catch(logout)
      .finally(() => setChecking(false))
  }, [logout])

  // API mengembalikan 401 -> keluar
  useEffect(() => {
    window.addEventListener(AUTH_LOGOUT_EVENT, logout)
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, logout)
  }, [logout])

  return (
    <AuthContext.Provider value={{ user, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus digunakan di dalam <AuthProvider>')
  return ctx
}
