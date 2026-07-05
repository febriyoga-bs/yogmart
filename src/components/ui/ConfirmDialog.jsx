import { useTheme } from '../../contexts/ThemeContext'
import { Modal } from './Modal'
import { Button } from './Button'

/**
 * Dialog konfirmasi hapus / aksi destruktif
 * @param {string} title
 * @param {string} message
 * @param {Function} onConfirm
 * @param {Function} onCancel
 * @param {boolean} danger - tombol konfirmasi merah
 */
export function ConfirmDialog({ title, message, onConfirm, onCancel, danger = false }) {
  const { theme } = useTheme()
  const C = theme.colors
  return (
    <Modal title={title} onClose={onCancel} width={380}>
      <p style={{ color: C.textMuted, marginBottom: 24, lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="secondary" onClick={onCancel} fullWidth>Batal</Button>
        <Button
          onClick={onConfirm}
          fullWidth
          style={danger ? { background: C.danger, color: '#fff', border: 'none' } : {}}>
          Konfirmasi
        </Button>
      </div>
    </Modal>
  )
}
