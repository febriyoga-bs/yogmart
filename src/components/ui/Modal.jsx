import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useIsMobile } from '../../hooks/useMediaQuery'

/**
 * Modal dialog dengan backdrop blur & animasi.
 * Di mobile tampil sebagai bottom sheet.
 *
 * @param {string} title
 * @param {Function} onClose
 * @param {number} width - max-width dalam px (default: 520)
 * @param {ReactNode} footer - slot untuk tombol aksi bawah
 * @param {ReactNode} actions - tombol tambahan di header, sebelah tombol tutup
 */
export function Modal({ title, onClose, children, width = 520, footer, actions }) {
  const { theme } = useTheme()
  const C = theme.colors
  const isMobile = useIsMobile()

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Kunci scroll halaman di belakang modal
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
        zIndex: 200, display: 'flex', justifyContent: 'center',
        alignItems: isMobile ? 'flex-end' : 'center',
        padding: isMobile ? 0 : 24, animation: 'tk-fadeIn 0.2s ease',
      }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          background: C.bgCard, width: '100%', maxWidth: isMobile ? '100%' : width,
          maxHeight: isMobile ? '92dvh' : '90vh', display: 'flex', flexDirection: 'column',
          borderRadius: isMobile ? '22px 22px 0 0' : 20,
          boxShadow: C.shadowLg, border: `1px solid ${C.border}`,
          animation: isMobile ? 'tk-sheetUp 0.28s cubic-bezier(.2,.8,.2,1)' : 'tk-slideUp 0.25s ease',
          paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : 0,
        }}>
        {/* Grab handle (mobile) */}
        {isMobile && <div style={{ width: 40, height: 4, borderRadius: 99, background: C.borderStrong, margin: '10px auto 0' }} />}

        {/* Header */}
        <div style={{ padding: isMobile ? '12px 18px 0' : '22px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <h2 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 800, color: C.text, minWidth: 0, marginRight: 'auto' }}>{title}</h2>
          {actions}
          <button onClick={onClose} aria-label="Tutup" style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            border: `1px solid ${C.border}`, background: C.bgMuted,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: C.textMuted,
          }}><X size={18} /></button>
        </div>

        {/* Body */}
        <div style={{ padding: isMobile ? '16px 18px 20px' : '18px 24px 24px', overflowY: 'auto', flex: 1, overscrollBehavior: 'contain' }}>
          {children}
        </div>

        {/* Footer (opsional) */}
        {footer && <div style={{ padding: isMobile ? '0 18px 18px' : '0 24px 22px' }}>{footer}</div>}
      </div>
    </div>
  )
}
