import { AlertTriangle, Clock, Droplets, Wrench } from 'lucide-react';

const ISSUE_META = {
  'broken-tap':          { label: 'Broken Tap',          icon: Wrench,        color: '#c1121f', bg: '#fde8e8' },
  'water-unavailable':   { label: 'Water Unavailable',   icon: Droplets,      color: '#e76f51', bg: '#fdeee9' },
  'leaking-pipe':        { label: 'Leaking Pipe',        icon: AlertTriangle, color: '#d4760a', bg: '#fef3e6' },
  'cooling-unavailable': { label: 'Cooling Unavailable', icon: AlertTriangle, color: '#7b5ea7', bg: '#f2eef9' },
};

const STATUS_BADGE = {
  open:         { label: 'Open',         bg: '#fde8e8', color: '#c1121f', dot: '#c1121f' },
  acknowledged: { label: 'In Review',    bg: '#fef3e6', color: '#d4760a', dot: '#f4a261' },
  resolved:     { label: 'Resolved',     bg: '#e8f7ef', color: '#2d6a4f', dot: '#52b788' },
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function RecentReports({ reports = [] }) {
  const latest = reports.slice(0, 5);

  return (
    <div style={{
      backgroundColor: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '0.9rem 1.25rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to right, var(--border-lt), var(--card))',
      }}>
        <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>
          📋 Recent Reports
        </h2>
        {latest.length > 0 && (
          <span style={{
            padding: '2px 9px',
            borderRadius: 99,
            fontSize: '0.72rem',
            fontWeight: 700,
            backgroundColor: '#fde8e8',
            color: '#c1121f',
          }}>
            {reports.filter(r => r.status === 'open').length} open
          </span>
        )}
      </div>

      {latest.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📭</div>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>No reports yet. Be the first to report an issue!</p>
        </div>
      ) : (
        <ul style={{ listStyle: 'none' }}>
          {latest.map((rpt, i) => {
            const meta  = ISSUE_META[rpt.issueType] || { label: rpt.issueType, icon: AlertTriangle, color: '#888', bg: '#f5f5f5' };
            const badge = STATUS_BADGE[rpt.status]  || STATUS_BADGE.open;
            const IssueIcon = meta.icon;

            return (
              <li
                key={rpt.id}
                style={{
                  padding: '0.9rem 1.25rem',
                  borderBottom: i < latest.length - 1 ? '1px solid var(--border-lt)' : 'none',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--border-lt)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Icon */}
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: meta.bg,
                  border: `1px solid ${meta.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <IssueIcon size={16} color={meta.color} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>{meta.label}</span>
                    {/* Status badge with dot */}
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      borderRadius: 99,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      backgroundColor: badge.bg,
                      color: badge.color,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}>
                      <span className="pulse-dot" style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', backgroundColor: badge.dot }} />
                      {badge.label}
                    </span>
                    {/* Mock badge */}
                    {rpt._mock && (
                      <span style={{ fontSize: '0.64rem', color: 'var(--muted-lt)', backgroundColor: 'var(--border-lt)', padding: '1px 6px', borderRadius: 4 }}>
                        local
                      </span>
                    )}
                  </div>

                  <p style={{
                    fontSize: '0.82rem',
                    color: 'var(--muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: 4,
                  }}>
                    {rpt.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.72rem', color: 'var(--muted-lt)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={10} />
                      {timeAgo(rpt.timestamp)}
                    </span>
                    <span>·</span>
                    <span>{rpt.lat?.toFixed(3)}, {rpt.lng?.toFixed(3)}</span>
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
