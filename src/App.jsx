import { useState, useReducer } from 'react'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import { Navbar } from './components/domain/Navbar'
import { CatalogPage } from './pages/CatalogPage'
import { ScannerPage } from './pages/ScannerPage'
import { AdminPage } from './pages/AdminPage'
import { productReducer, categoryReducer } from './utils/reducers'
import { SEED_PRODUCTS, SEED_CATEGORIES } from './utils/constants'

function AppInner() {
  const { theme } = useTheme()
  const C = theme.colors
  const [page, setPage] = useState('catalog')
  const [products,   dispatch]    = useReducer(productReducer,  SEED_PRODUCTS)
  const [categories, catDispatch] = useReducer(categoryReducer, SEED_CATEGORIES)

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: C.bg, minHeight: '100vh', color: C.text, transition: 'background 0.3s, color 0.3s' }}>
      <Navbar page={page} setPage={setPage} />

      {page === 'catalog' && <CatalogPage products={products} categories={categories} />}
      {page === 'scan'    && <ScannerPage products={products} />}
      {page === 'admin'   && <AdminPage   products={products} categories={categories} dispatch={dispatch} catDispatch={catDispatch} />}

      <footer style={{ marginTop: 48, padding: 24, borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
        <p style={{ color: C.textMuted, fontSize: 13 }}>© 2026 Warung Yoga · Katalog Digital </p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #88888840; border-radius: 99px; }
        input::placeholder { color: #a8a29e; }
        input[type=number]::-webkit-inner-spin-button { opacity: .4; }

        @keyframes tk-fadeIn  { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: translateY(0);  } }
        @keyframes tk-slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tk-spin    { to   { transform: rotate(360deg); } }
        @keyframes tk-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes tk-scanLine { 0%, 100% { top: 10px; } 50% { top: calc(100% - 12px); } }
      `}</style>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </ThemeProvider>
  )
}
