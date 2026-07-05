import { generateId } from './formatters'

// ─── Product Reducer ──────────────────────────────────────────────────────────

/**
 * @param {Array} state - daftar produk
 * @param {{ type: 'ADD'|'UPDATE'|'DELETE', payload: any }} action
 */
export const productReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [
        { ...action.payload, id: generateId('p'), created_at: new Date().toISOString() },
        ...state,
      ]
    case 'UPDATE':
      return state.map((p) =>
        p.id === action.payload.id
          ? { ...p, ...action.payload, updated_at: new Date().toISOString() }
          : p
      )
    case 'DELETE':
      return state.filter((p) => p.id !== action.payload)
    default:
      return state
  }
}

// ─── Category Reducer ─────────────────────────────────────────────────────────

/**
 * @param {Array} state - daftar kategori
 * @param {{ type: 'ADD'|'UPDATE'|'DELETE', payload: any }} action
 */
export const categoryReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [
        ...state,
        { ...action.payload, id: generateId('cat') },
      ]
    case 'UPDATE':
      return state.map((c) =>
        c.id === action.payload.id ? { ...c, ...action.payload } : c
      )
    case 'DELETE':
      return state.filter((c) => c.id !== action.payload)
    default:
      return state
  }
}
