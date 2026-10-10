import { AlertCircle, AlertOctagon, AlertTriangle, Clock, Droplets, MapPin, Wrench } from 'lucide-react';

const ISSUE_TYPES = {
  'broken-tap': {
    label: 'Broken Water Tap',
    icon: Wrench,
  },
  'water-unavailable': {
    label: 'No Water Supply',
    icon: Droplets,
  },
  'leaking-pipe': {
    label: 'Pipe Burst / Leak',
    icon: AlertTriangle,
  },
  'cooling-unavailable': {
    label: 'Cooling Station Outage',
    icon: AlertOctagon,
  },
};

const URGENCY_META = {
  severe: { label: 'Urgent Action Required', bg: 'var(--status-err-bg)', text: 'var(--status-err)', icon: AlertOctagon },
  high:   { label: 'High Priority',          bg: 'var(--status-warn-bg)', text: 'var(--status-warn)', icon: AlertTriangle },
  moderate: { label: 'Standard Report',      bg: 'var(--brand-aqua-light)', text: 'var(--brand-aqua-dark)', icon: AlertCircle },
  low:    { label: 'Low Priority',           bg: 'var(--bg-surface-subtle)', text: 'var(--text-sub)', icon: Clock },
};

function formatTimeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function RecentReports({ reports = [] }) {
  const displayReports = reports.slice(0, 6);

  return (
    <div id="incidents-section" style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Recent Community Incident Reports
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Live feed of water access problems logged by residents
          </p>
        </div>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: 99,
          backgroundColor: 'var(--bg-surface-subtle)',
          color: 'var(--text-sub)',
        }}>
          {reports.length} Total
        </span>
      </div>

      {/* Reports List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {displayReports.map((rpt) => {
          const typeMeta = ISSUE_TYPES[rpt.issueType] || { label: rpt.issueType, icon: AlertCircle };
          const urgency = URGENCY_META[rpt.urgency] || URGENCY_META.moderate;
          const TypeIcon = typeMeta.icon;
          const UrgencyIcon = urgency.icon;

          return (
            <div
              key={rpt.id}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {/* Top Row: Issue Title + Urgency Badge (Icon + Text) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-aqua-dark)',
                    border: '1px solid var(--border-color)',
                  }}>
                    <TypeIcon size={16} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    {rpt.issueLabel || typeMeta.label}
                  </span>
                </div>

                {/* Urgency Badge: Icon + Label */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 8px',
                  borderRadius: 99,
                  backgroundColor: urgency.bg,
                  color: urgency.text,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}>
                  <UrgencyIcon size={12} strokeWidth={2.5} />
                  <span>{urgency.label}</span>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', lineHeight: 1.45 }}>
                {rpt.description}
              </p>

              {/* Footer Meta */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                paddingTop: 4,
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={12} />
                  {rpt.lat.toFixed(3)}, {rpt.lng.toFixed(3)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} />
                  {formatTimeAgo(rpt.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
