import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const baseInputStyle = (C, focused, error) => ({
  width: '100%', padding: '10px 14px', borderRadius: 10,
  fontSize: 14, fontFamily: 'inherit', background: C.bgCard, color: C.text,
  border: `1.5px solid ${error ? C.danger : focused ? C.primary : C.border}`,
  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
  boxShadow: focused ? `0 0 0 3px ${error ? C.dangerBg : C.primaryAlpha}` : 'none',
})

const labelStyle = (C, error) => ({
  fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
  color: error ? C.danger : C.textMuted,
})

// ─── Input ────────────────────────────────────────────────────────────────────
/**
 * @param {string} label
 * @param {string} error - pesan error (merah)
 * @param {string} helper - teks helper (abu)
 * @param {ReactNode} prefix - elemen kiri (icon/teks)
 * @param {ReactNode} suffix - elemen kanan (icon/button)
 */
export function Input({ label, error, helper, prefix, suffix, style: propStyle = {}, ...props }) {
  const { theme } = useTheme()
  const C = theme.colors
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={labelStyle(C, error)}>{label}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <div style={{ position: 'absolute', left: 12, color: C.textMuted, display: 'flex', alignItems: 'center', pointerEvents: 'none', zIndex: 1 }}>
            {prefix}
          </div>
        )}
        <input
          {...props}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
          onBlur={(e)  => { setFocused(false); props.onBlur?.(e) }}
          style={{
            ...baseInputStyle(C, focused, error),
            paddingLeft:  prefix ? 40 : 14,
            paddingRight: suffix ? 40 : 14,
            ...propStyle,
          }}
        />
        {suffix && (
          <div style={{ position: 'absolute', right: 12, color: C.textMuted, display: 'flex', alignItems: 'center' }}>
            {suffix}
          </div>
        )}
      </div>
      {(error || helper) && (
        <div style={{ fontSize: 12, color: error ? C.danger : C.textMuted }}>{error ?? helper}</div>
      )}
    </div>
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, children, style: propStyle = {}, ...props }) {
  const { theme } = useTheme()
  const C = theme.colors
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={labelStyle(C, false)}>{label}</label>}
      <select
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...baseInputStyle(C, focused, false), ...propStyle }}>
        {children}
      </select>
    </div>
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({ label, style: propStyle = {}, ...props }) {
  const { theme } = useTheme()
  const C = theme.colors
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={labelStyle(C, false)}>{label}</label>}
      <textarea
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...baseInputStyle(C, focused, false), resize: 'vertical', minHeight: 80, ...propStyle }}
      />
    </div>
  )
}
