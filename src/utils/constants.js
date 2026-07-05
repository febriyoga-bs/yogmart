// ─── App Constants ────────────────────────────────────────────────────────────

export const APP_NAME = 'Warung Yoga'
export const APP_VERSION = '1.0.0'

// ─── Theme Definitions ────────────────────────────────────────────────────────

export const THEMES = {
  light: {
    name: 'light',
    label: 'Light',
    icon: '☀️',
    colors: {
      primary:       '#070047',
      primaryLight:  '#40577b',
      primaryDark:   '#0d2b1a',
      primaryAlpha:  'rgba(26,71,42,0.08)',
      accent:        '#e76f51',
      accentLight:   '#f4a261',
      bg:            '#faf9f6',
      bgCard:        '#ffffff',
      bgMuted:       '#f0ede8',
      bgHover:       '#e8e4de',
      text:          '#1c1917',
      textMuted:     '#78716c',
      textLight:     '#a8a29e',
      border:        '#e2ddd8',
      borderStrong:  '#c8c4be',
      success:       '#16a34a',
      successBg:     '#dcfce7',
      warning:       '#d97706',
      warningBg:     '#fef3c7',
      danger:        '#dc2626',
      dangerBg:      '#fee2e2',
      info:          '#2563eb',
      infoBg:        '#dbeafe',
      shadow:        '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
      shadowLg:      '0 8px 30px rgba(0,0,0,0.12)',
      heroGrad:      'linear-gradient(135deg, #40577b 0%, #070047 60%, #2d4d7a 100%)',
    },
  },
  dawn: {
    name: 'dawn',
    label: 'Dawn',
    icon: '🌅',
    colors: {
      primary:       '#9d4a2c',
      primaryLight:  '#b85c3a',
      primaryDark:   '#7a3520',
      primaryAlpha:  'rgba(157,74,44,0.08)',
      accent:        '#d4a853',
      accentLight:   '#e8c070',
      bg:            '#fdf7f0',
      bgCard:        '#fff9f4',
      bgMuted:       '#f5ebe0',
      bgHover:       '#edddd0',
      text:          '#2c1810',
      textMuted:     '#8b6050',
      textLight:     '#b89080',
      border:        '#e8d5c4',
      borderStrong:  '#d4bfae',
      success:       '#3d8c45',
      successBg:     '#d4edda',
      warning:       '#c07820',
      warningBg:     '#fdeacc',
      danger:        '#c0392b',
      dangerBg:      '#fce4e1',
      info:          '#2874a6',
      infoBg:        '#d6eaf8',
      shadow:        '0 1px 3px rgba(100,50,20,0.1), 0 4px 16px rgba(100,50,20,0.08)',
      shadowLg:      '0 8px 30px rgba(100,50,20,0.15)',
      heroGrad:      'linear-gradient(135deg, #4a1a08 0%, #9d4a2c 50%, #c4733a 100%)',
    },
  },
  dark: {
    name: 'dark',
    label: 'Dark',
    icon: '🌙',
    colors: {
      primary:       '#070047',
      primaryLight:  '#40577b',
      primaryDark:   '#070047',
      primaryAlpha:  'rgba(74,222,128,0.1)',
      accent:        '#fb923c',
      accentLight:   '#fdba74',
      bg:            '#0a0f0d',
      bgCard:        '#111816',
      bgMuted:       '#1a2420',
      bgHover:       '#243028',
      text:          '#f0fdf4',
      textMuted:     '#6b9980',
      textLight:     '#4a6b58',
      border:        '#1e2e26',
      borderStrong:  '#2a3e34',
      success:       '#4ade80',
      successBg:     '#052e16',
      warning:       '#fbbf24',
      warningBg:     '#1c1200',
      danger:        '#f87171',
      dangerBg:      '#2d0a0a',
      info:          '#60a5fa',
      infoBg:        '#0c1f3d',
      shadow:        '0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)',
      shadowLg:      '0 8px 30px rgba(0,0,0,0.5)',
      heroGrad:      'linear-gradient(135deg, #020705 0%, #0a1f14 50%, #0d2b1a 100%)',
    },
  },
}

// ─── Category Icons ───────────────────────────────────────────────────────────

export const CATEGORY_ICONS = [
  '🍜', '🌾', '🧼', '💊', '🍿', '🚬',
  '🥤', '🧃', '🍫', '🧂', '🫙', '📦',
  '🛒', '🏠', '✂️', '🧹', '🎯', '🧴',
]

// ─── Stock Thresholds ─────────────────────────────────────────────────────────

export const STOCK_THRESHOLD_LOW  = 10
export const STOCK_THRESHOLD_ZERO = 0

// ─── Unit Options ─────────────────────────────────────────────────────────────

export const UNIT_OPTIONS = [
  'buah', 'kg', 'gram', 'liter', 'ml',
  'bungkus', 'botol', 'karung', 'sachet',
  'lusin', 'pak', 'pcs',
]

// ─── Nav Items ────────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { id: 'catalog', label: 'Katalog',    icon: '🛒' },
  { id: 'scan',    label: 'Cek Harga',  icon: '📱' },
  { id: 'admin',   label: 'Dashboard',  icon: '⚙️'  },
]

// ─── Mock Seed Data ───────────────────────────────────────────────────────────

export const SEED_CATEGORIES = [
  { id: 'cat-1', name: 'Makanan & Minuman', icon: '🍜' },
  { id: 'cat-2', name: 'Sembako',           icon: '🌾' },
  { id: 'cat-3', name: 'Kebersihan',        icon: '🧼' },
  { id: 'cat-4', name: 'Kesehatan',         icon: '💊' },
  { id: 'cat-5', name: 'Snack',             icon: '🍿' },
]

export const SEED_PRODUCTS = [
  { id: 'p-1', name: 'Beras Premium 5kg',     barcode: '8991234567890', price: 75000, stock: 50, unit: 'karung',  category_id: 'cat-2', description: 'Beras pulen berkualitas tinggi' },
  { id: 'p-2', name: 'Mie Instan Goreng',     barcode: '8990123456789', price: 3500,  stock: 5,  unit: 'bungkus', category_id: 'cat-1', description: 'Mie instan rasa goreng lezat' },
  { id: 'p-3', name: 'Sabun Mandi',           barcode: '8993456789012', price: 5000,  stock: 0,  unit: 'buah',    category_id: 'cat-3', description: 'Sabun antibakteri segar' },
  { id: 'p-4', name: 'Gula Pasir 1kg',        barcode: '8994567890123', price: 14000, stock: 75, unit: 'kg',      category_id: 'cat-2', description: 'Gula pasir putih bersih' },
  { id: 'p-5', name: 'Chitato Sapi Panggang', barcode: '8995678901234', price: 8000,  stock: 3,  unit: 'bungkus', category_id: 'cat-5', description: 'Keripik kentang gurih renyah' },
  { id: 'p-6', name: 'Antangin JRG',          barcode: '8996789012345', price: 4500,  stock: 30, unit: 'sachet',  category_id: 'cat-4', description: 'Obat masuk angin herbal' },
  { id: 'p-7', name: 'Teh Botol Sosro',       barcode: '8997890123456', price: 5000,  stock: 20, unit: 'botol',   category_id: 'cat-1', description: 'Teh manis dingin segar' },
  { id: 'p-8', name: 'Deterjen Rinso 800g',   barcode: '8998901234567', price: 22000, stock: 40, unit: 'bungkus', category_id: 'cat-3', description: 'Deterjen formula bersih' },
]
