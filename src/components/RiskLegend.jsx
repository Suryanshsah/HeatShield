const RISK_LEVELS = [
  { label: 'Low',      color: '#52b788', bg: '#e8f7ef', description: 'Safe for outdoor activity' },
  { label: 'Moderate', color: '#f4a261', bg: '#fef3e6', description: 'Hydrate; take breaks' },
  { label: 'High',     color: '#e76f51', bg: '#fdeee9', description: 'Limit outdoor exposure' },
  { label: 'Severe',   color: '#c1121f', bg: '#fde8e8', description: 'Avoid outdoor activity' },
];

export default function RiskLegend() {
  return (
    <div style={{
      backgroundColor: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '0.75rem 1rem',
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
        color: '#fff',
      }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          🌡 Heat Risk Legend
        </h3>
      </div>

      <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {RISK_LEVELS.map(({ label, color, bg, description }) => (
          <div key={label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 8px',
            borderRadius: 8,
            backgroundColor: bg,
          }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              backgroundColor: color,
              flexShrink: 0,
              boxShadow: `0 0 0 2px ${color}30`,
            }} />
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: color }}>{label}</span>
              <span style={{ fontSize: '0.74rem', color: 'var(--muted)', marginLeft: 5 }}>{description}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0.5rem 1rem 0.75rem', borderTop: '1px solid var(--border-lt)' }}>
        <p style={{ fontSize: '0.68rem', color: 'var(--muted-lt)', fontStyle: 'italic', lineHeight: 1.4 }}>
          Zone colours are sample/illustrative data, not scientifically validated.
        </p>
      </div>
    </div>
  );
}
