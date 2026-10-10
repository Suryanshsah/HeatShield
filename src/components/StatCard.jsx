/**
 * StatCard — shows an icon, a label, and a large value.
 * Optional `subtitle` and `accent` color variant.
 */
export default function StatCard({ id, icon: Icon, label, value, subtitle, accentColor }) {
  const accent = accentColor || 'var(--color-forest)';

  return (
    <div
      id={id}
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        flex: '1 1 180px',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          backgroundColor: `${accent}18`,
          borderRadius: 8,
          padding: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {Icon && <Icon size={20} color={accent} strokeWidth={2} />}
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>

      <div style={{ fontSize: '2rem', fontWeight: 700, color: accent, lineHeight: 1.1 }}>
        {value ?? '—'}
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{subtitle}</div>
      )}
    </div>
  );
}
