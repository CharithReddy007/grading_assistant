import React from 'react';

/* ─── Button ─────────────────────────────────────────────────────────────── */
export function Button({ children, variant = 'default', size = 'md', onClick, disabled, style, icon }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    border: '1px solid', borderRadius: 8, fontWeight: 500,
    fontFamily: 'inherit', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1, transition: 'all 0.15s',
  };
  const sizes = {
    sm: { height: 28, padding: '0 10px', fontSize: 12 },
    md: { height: 36, padding: '0 14px', fontSize: 13 },
    lg: { height: 40, padding: '0 18px', fontSize: 14 },
  };
  const variants = {
    default: { background: '#fff', borderColor: '#d1d5db', color: '#374151' },
    primary:  { background: '#2563eb', borderColor: '#2563eb', color: '#fff' },
    danger:   { background: '#fff', borderColor: '#dc2626', color: '#dc2626' },
    ghost:    { background: 'transparent', borderColor: 'transparent', color: '#6b7280' },
  };
  return (
    <button
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
      {children}
    </button>
  );
}

/* ─── Badge ──────────────────────────────────────────────────────────────── */
export function Badge({ children, color = 'gray', style }) {
  const palettes = {
    green:  { bg: '#dcfce7', text: '#15803d' },
    red:    { bg: '#fee2e2', text: '#dc2626' },
    yellow: { bg: '#fef9c3', text: '#a16207' },
    blue:   { bg: '#dbeafe', text: '#1d4ed8' },
    gray:   { bg: '#f3f4f6', text: '#6b7280' },
  };
  const p = palettes[color] || palettes.gray;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: p.bg, color: p.text, whiteSpace: 'nowrap', ...style,
    }}>
      {children}
    </span>
  );
}

/* ─── Card ───────────────────────────────────────────────────────────────── */
export function Card({ children, style, padding = '1.25rem 1.5rem' }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: 12, padding, ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── SectionTitle ───────────────────────────────────────────────────────── */
export function SectionTitle({ title, sub }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111827' }}>{title}</h2>
      {sub && <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

/* ─── Input ──────────────────────────────────────────────────────────────── */
export function Input({ value, onChange, placeholder, style, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', height: 36, padding: '0 10px',
        border: '1px solid #d1d5db', borderRadius: 8,
        fontSize: 13, fontFamily: 'inherit', color: '#111827',
        background: '#fff', outline: 'none', ...style,
      }}
      onFocus={e => (e.target.style.borderColor = '#2563eb')}
      onBlur={e => (e.target.style.borderColor = '#d1d5db')}
    />
  );
}

/* ─── Avatar ─────────────────────────────────────────────────────────────── */
export function Avatar({ name, bg = '#dbeafe', fg = '#1e40af', size = 32 }) {
  const initials = name
    .replace(/[^a-zA-Z\s]/g, '')
    .split(' ')
    .map(w => w[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: fg, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

/* ─── Divider ────────────────────────────────────────────────────────────── */
export function Divider({ style }) {
  return <div style={{ borderTop: '1px solid #f3f4f6', margin: '1rem 0', ...style }} />;
}

/* ─── Label ──────────────────────────────────────────────────────────────── */
export function Label({ children, style }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, ...style }}>
      {children}
    </p>
  );
}
