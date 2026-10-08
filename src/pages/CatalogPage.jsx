import { useTheme } from '../contexts/ThemeContext'
import { useProductFilter } from '../hooks/useProductFilter'
import { SearchBar, FilterPill, EmptyState, PageHero, Skeleton } from '../components/ui'
import { ProductCard, ProductDetailModal, ProductFormModal } from '../components/domain'
import { useAuth } from '../contexts/AuthContext'
import { useSaveProduct } from '../hooks/useSaveProduct'
import { useState } from 'react'
import { useOutletContext } from "react-router-dom";
import { APP_NAME } from '../utils/constants'

/**
 * Halaman katalog publik — tampil grid produk, filter kategori & search
 */
export function CatalogPage() {
  const { theme } = useTheme()
  const C = theme.colors
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [detailId, setDetailId] = useState(null)
  const [editing, setEditing] = useState(null)
  const { user } = useAuth()
  const saveProduct = useSaveProduct()

  const {
    products,
    categories
  } = useOutletContext();
  const { filtered, total, isEmpty } = useProductFilter(products, { search, categoryId })
  const getCat = (id) => categories.find((c) => c.id === id)
  // Ambil dari daftar terbaru supaya detail ikut ter-update setelah diedit
  const detail = products.find((p) => p.id === detailId)

  const handleSave = async (formData) => {
    if (await saveProduct(formData)) setEditing(null)
  }
  const loading = products.length === 0 && !search && !categoryId

  return (
    <div>
      <PageHero
        eyebrow={`🛒 ${APP_NAME}`}
        title="Katalog Belanja"
        subtitle="Temukan semua kebutuhan sehari-hari dengan harga terbaik"
      >
        <div style={{ maxWidth: 520 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Cari produk atau barcode..." />
        </div>
      </PageHero>

      {/* Filter kategori — menempel di bawah header saat scroll */}
      <div style={{
        position: 'sticky', top: 'calc(60px + env(safe-area-inset-top))', zIndex: 20,
        background: `${C.bg}f0`, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      }}>
        <div className="tk-container tk-hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingTop: 12, paddingBottom: 12 }}>
          <FilterPill label="Semua" icon="✨" active={!categoryId} onClick={() => setCategoryId('')} />
          {categories.map((c) => (
            <FilterPill
              key={c.id}
              label={c.name}
              icon={c.icon}
              active={categoryId === c.id}
              onClick={() => setCategoryId(categoryId === c.id ? '' : c.id)}
            />
          ))}
        </div>
      </div>

      <div className="tk-container" style={{ paddingTop: 8, paddingBottom: 28 }}>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 14 }}>
          Menampilkan <strong style={{ color: C.text }}>{filtered.length}</strong> dari {total} produk
        </div>

        {loading ? (
          <div className="tk-product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} height={240} radius={18} />
            ))}
          </div>
        ) : isEmpty ? (
          <EmptyState
            icon="🔍"
            title="Produk tidak ditemukan"
            description="Coba ubah kata kunci atau pilih kategori lain"
          />
        ) : (
          <div className="tk-product-grid">
            {filtered.map((p, i) => (
              <div key={p.id} style={{ animation: `tk-fadeIn 0.4s ${Math.min(i, 12) * 0.03}s both` }}>
                <ProductCard product={p} category={getCat(p.category_id)} onClick={() => setDetailId(p.id)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {detail && !editing && (
        <ProductDetailModal
          product={detail}
          category={getCat(detail.category_id)}
          onClose={() => setDetailId(null)}
          onEdit={user ? () => setEditing({ ...detail }) : undefined}
        />
      )}
      {editing && (
        <ProductFormModal initial={editing} categories={categories} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}
