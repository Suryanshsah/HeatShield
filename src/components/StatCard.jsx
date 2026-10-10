/**
 * StatCard — Civic tech rounded card (xl) with generous spacing, soft shadows,
 * explicit text label + icon pairing, and strict color usage.
 */
export default function StatCard({ id, icon: Icon, label, value, subtitle, badgeText, badgeIcon: BadgeIcon, badgeVariant = 'aqua' }) {

  // Variant color mapping for non-heat metrics vs heat metrics
  const variantStyles = {
    aqua: {
      bg: 'var(--brand-aqua-light)',
      text: 'var(--brand-aqua-dark)',
      border: 'var(--brand-aqua)',
    },
    neutral: {
      bg: 'var(--bg-surface-subtle)',
      text: 'var(--text-sub)',
      border: 'var(--border-color)',
    },
    // Heat-only variants (reserved exclusively for heat risk)
    'heat-low': {
      bg: 'var(--heat-low-bg)',
      text: '#92400e', // Darker yellow/amber for contrast
      border: 'var(--heat-low)',
    },
    'heat-moderate': {
      bg: 'var(--heat-mod-bg)',
      text: '#c2410c', // Darker orange
      border: 'var(--heat-moderate)',
    },
    'heat-high': {
      bg: 'var(--heat-high-bg)',
      text: '#b91c1c', // Darker red
      border: 'var(--heat-high)',
    },
    'heat-severe': {
      bg: 'var(--heat-sev-bg)',
      text: '#780000', // Deep maroon
      border: 'var(--heat-severe)',
    },
  };

  const currentVariant = variantStyles[badgeVariant] || variantStyles.aqua;

  return (
    <div
      id={id}
      className="animate-fade-in"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 12,
        boxShadow: 'var(--shadow-sm)',
        flex: '1 1 220px',
        minWidth: 0,
        transition: 'transform var(--transition-fast), boxShadow var(--transition-fast)',
      }}
    >
      {/* Header: Label + Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '0.82rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {label}
        </span>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--brand-aqua)',
        }}>
          {Icon && <Icon size={20} strokeWidth={2} />}
        </div>
      </div>

      {/* Main Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{
          fontSize: '2.4rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
        }}>
          {value ?? '—'}
        </span>
      </div>

      {/* Footer: Badge (Pairing Color + Text Label + Icon) + Subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {badgeText && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 10px',
            borderRadius: 99,
            backgroundColor: currentVariant.bg,
            color: currentVariant.text,
            fontSize: '0.75rem',
            fontWeight: 700,
            border: `1px solid ${currentVariant.border}`,
          }}>
            {BadgeIcon && <BadgeIcon size={13} strokeWidth={2.5} />}
            <span>{badgeText}</span>
          </div>
        )}
        {subtitle && (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
