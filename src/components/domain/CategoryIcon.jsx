import {
  IceCreamCone, SprayCan, CupSoda, Pill, Cigarette, Croissant, Wheat, Popcorn,
  Soup, GlassWater, Candy, Milk, Package, ShoppingCart, House, Scissors, Brush,
  Droplet, Egg, Coffee, Cookie, Utensils, Baby, Flame,
} from 'lucide-react'

// Ikon kategori yang bisa dipilih admin (nilai yang disimpan = key-nya)
export const CATEGORY_ICON_SET = {
  'ice-cream': IceCreamCone,
  drink: CupSoda,
  juice: GlassWater,
  milk: Milk,
  coffee: Coffee,
  bread: Croissant,
  rice: Wheat,
  noodle: Soup,
  snack: Popcorn,
  cookie: Cookie,
  candy: Candy,
  egg: Egg,
  food: Utensils,
  medicine: Pill,
  cigarette: Cigarette,
  cleaning: SprayCan,
  toiletries: Droplet,
  broom: Brush,
  baby: Baby,
  gas: Flame,
  household: House,
  tools: Scissors,
  groceries: ShoppingCart,
  other: Package,
}

// Kategori lama di database masih menyimpan emoji: dipetakan ke ikon yang sama artinya
const LEGACY = {
  '\u{1F366}': 'ice-cream', '\u{1F9FC}': 'cleaning', '\u{1F964}': 'drink', '\u{1F48A}': 'medicine',
  '\u{1F6AC}': 'cigarette', '\u{1F35E}': 'bread', '\u{1F33E}': 'rice', '\u{1F37F}': 'snack',
  '\u{1F35C}': 'noodle', '\u{1F9C3}': 'juice', '\u{1F36B}': 'candy', '\u{1F9C2}': 'food',
  '\u{1FAD9}': 'food', '\u{1F4E6}': 'other', '\u{1F6D2}': 'groceries', '\u{1F3E0}': 'household',
  '✂️': 'tools', '✂': 'tools', '\u{1F9F9}': 'broom', '\u{1F3AF}': 'other', '\u{1F9F4}': 'toiletries',
}

export const resolveCategoryIcon = (icon) =>
  CATEGORY_ICON_SET[icon] ?? CATEGORY_ICON_SET[LEGACY[icon]] ?? Package

/**
 * Ikon kategori (garis Lucide), menerima key baru maupun emoji lama dari database
 * @param {string} icon - key ikon atau emoji lama
 */
export function CategoryIcon({ icon, size = 16, strokeWidth = 1.75, ...props }) {
  const Icon = resolveCategoryIcon(icon)
  return <Icon size={size} strokeWidth={strokeWidth} aria-hidden {...props} />
}
