import { Sun } from 'lucide-react';

export default function HourlyForecastStrip({ hourly = [] }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          The next few hours
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Example forecast
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 6,
        overflowX: 'auto',
        paddingBottom: 4,
      }}>
        {hourly.map((item, idx) => {
          const isNow = item.active || idx === 0;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px 4px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isNow ? 'rgba(111, 211, 184, 0.12)' : 'var(--bg-surface-subtle)',
                border: isNow ? '1.5px solid #6FD3B8' : '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)',
                minWidth: 44,
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: isNow ? 800 : 600, color: isNow ? '#6FD3B8' : 'var(--text-muted)' }}>
                {item.time}
              </span>

              <Sun size={16} color={item.color} style={{ margin: '6px 0' }} />

              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
                {item.temp}
              </span>

              {/* Thin heat risk bar */}
              <div style={{
                width: '80%',
                height: 3,
                borderRadius: 99,
                backgroundColor: item.color,
                marginBottom: 4,
              }} />

              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {item.risk}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
