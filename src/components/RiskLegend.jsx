const RISK_LEVELS = [
  { label: 'Low',      color: 'var(--color-low)',      description: 'Safe for outdoor activity' },
  { label: 'Moderate', color: 'var(--color-moderate)', description: 'Stay hydrated; take breaks' },
  { label: 'High',     color: 'var(--color-high)',     description: 'Limit outdoor exposure' },
  { label: 'Severe',   color: 'var(--color-severe)',   description: 'Avoid outdoor activity' },
];

export default function RiskLegend() {
  return (
    <div style={{
      backgroundColor: 'var(--color-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 12,
      padding: '1rem 1.25rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        Heat Risk Legend
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {RISK_LEVELS.map(({ label, color, description }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              backgroundColor: color,
              flexShrink: 0,
            }} />
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text)' }}>{label}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginLeft: 6 }}>{description}</span>
            </div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 12, fontSize: '0.72rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>
        Zone colours are sample data and not scientifically validated.
      </p>
    </div>
  );
}
