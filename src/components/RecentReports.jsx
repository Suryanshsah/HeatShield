import { AlertTriangle, Clock, Droplets, Wrench } from 'lucide-react';

const ISSUE_META = {
  'broken-tap':          { label: 'Broken Tap',           icon: Wrench,       color: '#d62828' },
  'water-unavailable':   { label: 'Water Unavailable',    icon: Droplets,     color: '#e76f51' },
  'leaking-pipe':        { label: 'Leaking Pipe',         icon: AlertTriangle,color: '#f4a261' },
  'cooling-unavailable': { label: 'Cooling Unavailable',  icon: AlertTriangle,color: '#9b5de5' },
};

const STATUS_BADGE = {
  open:         { label: 'Open',         bg: '#fce4e4', color: '#d62828' },
  acknowledged: { label: 'Acknowledged', bg: '#fff3e0', color: '#e76f51' },
  resolved:     { label: 'Resolved',     bg: '#e6f4ec', color: '#2d6a4f' },
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function RecentReports({ reports = [] }) {
  const latest = reports.slice(0, 5);

  return (
    <div style={{
      backgroundColor: 'var(--color-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>Recent Reports</h2>
      </div>

      {latest.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
          No reports yet.
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {latest.map((rpt, i) => {
            const meta   = ISSUE_META[rpt.issueType] || { label: rpt.issueType, icon: AlertTriangle, color: '#888' };
            const badge  = STATUS_BADGE[rpt.status]  || STATUS_BADGE.open;
            const IssueIcon = meta.icon;

            return (
              <li
                key={rpt.id}
                style={{
                  padding: '0.85rem 1.25rem',
                  borderBottom: i < latest.length - 1 ? '1px solid var(--color-border)' : 'none',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  backgroundColor: `${meta.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <IssueIcon size={16} color={meta.color} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text)' }}>{meta.label}</span>
                    <span style={{
                      padding: '1px 8px',
                      borderRadius: 99,
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      backgroundColor: badge.bg,
                      color: badge.color,
                    }}>
                      {badge.label}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {rpt.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: 'var(--color-muted)', fontSize: '0.75rem' }}>
                    <Clock size={11} />
                    {timeAgo(rpt.timestamp)}
                    <span style={{ marginLeft: 6, color: '#aaa' }}>{rpt.lat.toFixed(3)}, {rpt.lng.toFixed(3)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
