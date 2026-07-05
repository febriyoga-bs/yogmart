import { useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

/**
 * Modal dialog dengan backdrop blur & animasi
 *
 * @param {string} title
 * @param {Function} onClose
 * @param {number} width - max-width dalam px (default: 520)
 * @param {ReactNode} footer - slot untuk tombol aksi bawah
 */
export function Modal({ title, onClose, children, width = 520, footer }) {
  const { theme } = useTheme()
  const C = theme.colors

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, animation: 'tk-fadeIn 0.2s ease',
      }}>
      <div style={{
        background: C.bgCard, borderRadius: 20, width: '100%', maxWidth: width,
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: C.shadowLg, border: `1px solid ${C.border}`,
        animation: 'tk-slideUp 0.25s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{title}</h2>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: '50%',
            border: `1.5px solid ${C.border}`, background: 'transparent',
            cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: C.textMuted, transition: 'all 0.2s',
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer (opsional) */}
        {footer && <div style={{ padding: '0 24px 22px' }}>{footer}</div>}
      </div>
    </div>
  )
}
