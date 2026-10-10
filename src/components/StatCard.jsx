export default function StatCard({ id, icon: Icon, label, value, subtitle, accentColor, trend }) {
  const accent = accentColor || 'var(--forest)';

  return (
    <div
      id={id}
      className="fade-up"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.4rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: 'var(--shadow-sm)',
        flex: '1 1 200px',
        minWidth: 0,
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Decorative corner blob */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80,
        borderRadius: '50%',
        backgroundColor: `${accent}10`,
        pointerEvents: 'none',
      }} />

      {/* Top row: icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          background: `linear-gradient(135deg, ${accent}22, ${accent}10)`,
          border: `1px solid ${accent}30`,
          borderRadius: 10,
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {Icon && <Icon size={20} color={accent} strokeWidth={2} />}
        </div>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
        }}>
          {label}
        </span>
      </div>

      {/* Value */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <span style={{
          fontSize: '2.25rem',
          fontWeight: 800,
          color: accent,
          lineHeight: 1,
          letterSpacing: '-0.03em',
        }}>
          {value ?? '—'}
        </span>
        {trend && (
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: trend > 0 ? 'var(--danger)' : 'var(--low)',
            marginBottom: 4,
          }}>
            {trend > 0 ? `↑ ${trend}` : `↓ ${Math.abs(trend)}`}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: -4 }}>
          {subtitle}
        </div>
      )}

      {/* Accent line at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 3,
        background: `linear-gradient(90deg, ${accent}, ${accent}55)`,
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
      }} />
    </div>
  );
}
