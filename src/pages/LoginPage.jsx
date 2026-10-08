import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { Card, Input, Button } from '../components/ui'

/**
 * Halaman login admin
 */
export function LoginPage() {
  const { theme } = useTheme()
  const C = theme.colors
  const { user, login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectTo = location.state?.from || '/admin'

  if (user) return <Navigate to={redirectTo} replace />

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Username dan password wajib diisi')
      return
    }

    setLoading(true)
    setError('')
    try {
      const u = await login(form.username.trim(), form.password)
      showToast(`Selamat datang, ${u.name}!`)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal login, coba lagi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: C.bg }}>
      <Card padding="xl" style={{ width: '100%', maxWidth: 400, animation: 'tk-slideUp 0.3s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Admin Panel</div>
          <h1 style={{ fontSize: 28, color: C.text, fontWeight: 400, fontFamily: 'Georgia,serif' }}>Masuk <em>Warung</em></h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Username" value={form.username} onChange={set('username')} autoComplete="username" autoFocus />
          <Input label="Password" type="password" value={form.password} onChange={set('password')} autoComplete="current-password" />

          {error && (
            <div style={{ fontSize: 13, color: C.danger, background: C.dangerBg, padding: '10px 14px', borderRadius: 10 }}>{error}</div>
          )}

          <Button type="submit" fullWidth loading={loading} style={{ marginTop: 6 }}>Masuk</Button>
        </form>
      </Card>
    </div>
  )
}
