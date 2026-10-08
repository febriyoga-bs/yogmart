import { useEffect, useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { productAPI } from '../../api'
import { formatDateTime, formatPrice } from '../../utils/formatters'
import { Modal } from '../ui/Modal'
import { Spinner } from '../ui/Spinner'
import { EmptyState } from '../ui/EmptyState'

const FIELD_LABELS = {
  name: 'Nama',
  price: 'Harga',
  stock: 'Stok',
  category_id: 'Kategori',
  description: 'Deskripsi',
  barcode: 'Barcode',
  image_url: 'Gambar',
  alfagift_price: 'Harga Alfagift',
}

const ACTION_LABELS = {
  create: { text: 'Dibuat', icon: '🆕' },
  update: { text: 'Diubah', icon: '✏️' },
  delete: { text: 'Dihapus', icon: '🗑️' },
}

/**
 * Modal riwayat perubahan produk: kapan, oleh siapa, dan field apa yang berubah
 * @param {{ id, name }} product
 * @param {Array} categories
 * @param {Function} onClose
 */
export function ProductHistoryModal({ product, categories, onClose }) {
  const { theme } = useTheme()
  const C = theme.colors

  const [logs, setLogs] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    productAPI.getLogs(product.id)
      .then(setLogs)
      .catch((err) => setError(err.response?.data?.message || 'Gagal memuat riwayat'))
  }, [product.id])

  const formatValue = (field, value) => {
    if (value === null || value === undefined || value === '') return '—'
    if (field === 'price' || field === 'alfagift_price') return formatPrice(value)
    if (field === 'category_id') {
      const cat = categories.find((c) => c.id === value)
      return cat ? `${cat.icon} ${cat.name}` : value
    }
    if (field === 'image_url') return 'gambar baru'
    return String(value)
  }

  return (
    <Modal title={`Riwayat · ${product.name}`} onClose={onClose} width={560}>
      {error ? (
        <div style={{ fontSize: 14, color: C.danger }}>{error}</div>
      ) : logs === null ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <Spinner size={28} color={C.primary} />
        </div>
      ) : logs.length === 0 ? (
        <EmptyState icon="🕓" title="Belum ada riwayat" description="Perubahan produk akan tercatat di sini" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {logs.map((log) => {
            const action = ACTION_LABELS[log.action] ?? { text: log.action, icon: '•' }
            const entries = Object.entries(log.changes ?? {})
            return (
              <div key={log.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span>{action.icon}</span>
                  <span style={{ fontWeight: 800, fontSize: 14, color: C.text }}>{action.text}</span>
                  <span style={{ fontSize: 13, color: C.textMuted }}>oleh <b style={{ color: C.text }}>{log.user_name ?? '—'}</b></span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: C.textMuted }}>{formatDateTime(log.created_at)}</span>
                </div>

                {entries.length > 0 && (
                  <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 12px', fontSize: 13 }}>
                    {entries.map(([field, { from, to }]) => (
                      <div key={field} style={{ display: 'contents' }}>
                        <span style={{ color: C.textMuted, fontWeight: 700 }}>{FIELD_LABELS[field] ?? field}</span>
                        <span style={{ color: C.text, wordBreak: 'break-word' }}>
                          {log.action === 'update' && (
                            <><span style={{ color: C.danger, textDecoration: 'line-through' }}>{formatValue(field, from)}</span>{' → '}</>
                          )}
                          <span style={{ color: C.success, fontWeight: 700 }}>{formatValue(field, to)}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Modal>
  )
}
