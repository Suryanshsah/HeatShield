import { AlertOctagon, AlertTriangle, ShieldCheck, Sun } from 'lucide-react';

const HEAT_LEVELS = [
  {
    tier: 'Low',
    label: 'Low Heat Risk',
    temp: '35°C–37°C',
    color: 'var(--heat-low)',
    textColor: '#92400e',
    bgColor: 'var(--heat-low-bg)',
    icon: ShieldCheck,
    advisory: 'Normal hydration. Safe for ordinary outdoor activity.',
  },
  {
    tier: 'Moderate',
    label: 'Moderate Heat Risk',
    temp: '38°C–40°C',
    color: 'var(--heat-moderate)',
    textColor: '#c2410c',
    bgColor: 'var(--heat-mod-bg)',
    icon: Sun,
    advisory: 'Seek shade during peak afternoon hours. Drink water frequently.',
  },
  {
    tier: 'High',
    label: 'High Heat Risk',
    temp: '41°C–43°C',
    color: 'var(--heat-high)',
    textColor: '#b91c1c',
    bgColor: 'var(--heat-high-bg)',
    icon: AlertTriangle,
    advisory: 'Limit strenuous outdoor work. High risk of heat illness.',
  },
  {
    tier: 'Severe',
    label: 'Severe Heat Hazard',
    temp: '44°C+',
    color: 'var(--heat-severe)',
    textColor: '#780000',
    bgColor: 'var(--heat-sev-bg)',
    icon: AlertOctagon,
    advisory: 'Emergency heat precautions required. Avoid direct sunlight.',
  },
];

export default function RiskLegend() {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{
          fontSize: '0.85rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <Sun size={16} color="var(--brand-aqua)" />
          Heat Risk Scale &amp; Guidelines
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
          Color gradient is reserved exclusively for temperature heat hazards.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {HEAT_LEVELS.map(({ tier, label, temp, color, textColor, bgColor, icon: Icon, advisory }) => (
          <div
            key={tier}
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: bgColor,
              borderLeft: `4px solid ${color}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={16} color={textColor} strokeWidth={2.5} />
                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: textColor }}>
                  {label}
                </span>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: textColor,
                backgroundColor: 'rgba(255,255,255,0.6)',
                padding: '1px 7px',
                borderRadius: 4,
              }}>
                {temp}
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-sub)', marginTop: 2, lineHeight: 1.4 }}>
              {advisory}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
