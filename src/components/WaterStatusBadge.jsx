import { AlertTriangle, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';

export default function WaterStatusBadge({ status, reportedByNeighbours }) {
  const configs = {
    Available: {
      label: 'Available',
      bg: 'var(--brand-aqua-light)',
      color: 'var(--brand-aqua-dark)',
      borderColor: '#6FD3B8',
      icon: CheckCircle2,
    },
    'Low flow': {
      label: 'Low Flow',
      bg: 'rgba(238, 150, 75, 0.15)',
      color: '#EE964B',
      borderColor: '#EE964B',
      icon: AlertTriangle,
    },
    'Not working': {
      label: 'Not Working',
      bg: 'rgba(249, 87, 56, 0.15)',
      color: '#F95738',
      borderColor: '#F95738',
      icon: XCircle,
    },
    Unknown: {
      label: 'Unknown Status',
      bg: 'var(--bg-surface-subtle)',
      color: 'var(--text-muted)',
      borderColor: 'var(--border-color)',
      icon: HelpCircle,
    },
  };

  const cfg = configs[status] || configs.Unknown;
  const IconComp = cfg.icon;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 10px',
        borderRadius: 99,
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.borderColor}`,
        fontSize: '0.75rem',
        fontWeight: 800,
      }}>
        <IconComp size={13} />
        <span>{cfg.label}</span>
      </div>

      {reportedByNeighbours && (
        <span style={{ fontSize: '0.68rem', color: '#F95738', fontWeight: 700, paddingLeft: 4 }}>
          ⚠️ Reported by neighbours
        </span>
      )}
    </div>
  );
}
