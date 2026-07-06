import { useTheme } from '../contexts/ThemeContext'
import { useProductFilter } from '../hooks/useProductFilter'
import { SearchBar, FilterPill, EmptyState } from '../components/ui'
import { ProductCard } from '../components/domain'
import { useState } from 'react'
import { useOutletContext } from "react-router-dom";

/**
 * Halaman katalog publik — tampil grid produk, filter kategori & search
 */
export function CatalogPage() {
  const { theme } = useTheme()
  const C = theme.colors
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const {
    products,
    categories
  } = useOutletContext();
  const { filtered, total, isEmpty } = useProductFilter(products, { search, categoryId })
  const getCat = (id) => categories.find((c) => c.id === id)

  return (
    <div>
      {/* Hero */}
      <div style={{ background: C.heroGrad, padding: '48px 24px 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -50, left: '25%', width: 240, height: 240, background: `${C.accent}18`, borderRadius: '50%' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            🛒 Warung Yoga
          </div>
          <h1 style={{ fontSize: 'clamp(30px,4vw,48px)', color: 'white', fontWeight: 400, fontFamily: 'Georgia,serif', lineHeight: 1.1, marginBottom: 12 }}>
            Katalog <em>Belanja</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, marginBottom: 28 }}>
            Temukan semua kebutuhan sehari-hari dengan harga terbaik
          </p>
          <div style={{ maxWidth: 500 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Cari produk atau barcode..." />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 22 }}>
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

        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 18 }}>
          Menampilkan <strong style={{ color: C.text }}>{filtered.length}</strong> dari {total} produk
        </div>

        {/* Grid */}
        {isEmpty ? (
          <EmptyState
            icon="🔍"
            title="Produk tidak ditemukan"
            description="Coba ubah kata kunci atau pilih kategori lain"
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 18 }}>
            {filtered.map((p, i) => (
              <div key={p.id} style={{ animation: `tk-fadeIn 0.4s ${i * 0.04}s both` }}>
                <ProductCard product={p} category={getCat(p.category_id)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
