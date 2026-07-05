import { createContext, useContext, useState, useCallback } from 'react'
import { generateId } from '../utils/formatters'
import { useTheme } from './ThemeContext'

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null)

// ─── Toast Item Component ────────────────────────────────────────────────────
function ToastItem({ toast, onDismiss }) {
  const { theme } = useTheme()
  const C = theme.colors

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }
  const borders = {
    success: C.successBg,
    error:   C.dangerBg,
    warning: C.warningBg,
    info:    C.infoBg,
  }

  return (
    <div style={{
      background:    C.bgCard,
      border:        `1.5px solid ${borders[toast.type] ?? C.border}`,
      borderRadius:  12,
      padding:       '12px 16px',
      display:       'flex',
      alignItems:    'center',
      gap:           10,
      boxShadow:     C.shadowLg,
      animation:     'tk-slideUp 0.3s ease',
      minWidth:      260,
      maxWidth:      360,
    }}>
      <span style={{ fontSize: 18 }}>{icons[toast.type] ?? '💬'}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: C.text, flex: 1 }}>
        {toast.message}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          border: 'none', background: 'none', cursor: 'pointer',
          color: C.textMuted, fontSize: 18, padding: 0, lineHeight: 1,
        }}>
        ×
      </button>
    </div>
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = generateId('toast')
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Container */}
      {toasts.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast harus digunakan di dalam <ToastProvider>')
  return ctx
}
