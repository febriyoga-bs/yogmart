import { Pencil } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { formatPrice } from '../../utils/formatters'
import { getProductImage } from '../../utils/productImage'
import { Modal } from '../ui/Modal'
import { StockBadge } from './StockBadge'
import { AlfagiftCompare } from './AlfagiftCompare'

/**
 * Detail produk (dibuka saat kartu katalog diklik)
 * @param {object} product
 * @param {{ icon, name }} category
 * @param {Function} onClose
 * @param {Function} onEdit - kalau diisi (admin login), tampil tombol edit di header
 */
export function ProductDetailModal({ product, category, onClose, onEdit }) {
  const { theme } = useTheme()
  const C = theme.colors
  const image = getProductImage(product)

  return (
    <Modal
      title={product.name}
      onClose={onClose}
      width={460}
      actions={onEdit && (
        <button onClick={onEdit} aria-label="Edit produk" title="Edit produk" style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          border: `1px solid ${C.border}`, background: C.primaryAlpha, color: C.primary,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Pencil size={16} />
        </button>
      )}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ aspectRatio: '16 / 10', background: '#fff', borderRadius: 16, border: `1px solid ${C.border}`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
          {image
            ? <img src={image} alt={product.name} style={{ position: 'absolute', inset: 14, width: 'calc(100% - 28px)', height: 'calc(100% - 28px)', objectFit: 'contain' }} />
            : category?.icon ?? '📦'}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <div>
            {category && <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 700 }}>{category.icon} {category.name}</div>}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: C.primary, letterSpacing: '-0.02em' }}>{formatPrice(product.price)}</span>
              <span style={{ fontSize: 13, color: C.textMuted }}>/{product.unit}</span>
            </div>
          </div>
          <StockBadge stock={product.stock} />
        </div>

        {product.description && (
          <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>{product.description}</p>
        )}

        <AlfagiftCompare product={product} />

        <div style={{ fontSize: 12, color: C.textLight, fontFamily: 'monospace', textAlign: 'center' }}>
          Barcode {product.barcode}
        </div>
      </div>
    </Modal>
  )
}
