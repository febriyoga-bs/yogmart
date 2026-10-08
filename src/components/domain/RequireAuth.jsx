import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Spinner } from '../ui/Spinner'

/**
 * Bungkus route yang wajib login. Belum login -> redirect ke /login
 */
export function RequireAuth({ children }) {
  const { user, checking } = useAuth()
  const { theme } = useTheme()
  const location = useLocation()

  if (checking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spinner size={32} color={theme.colors.primary} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
