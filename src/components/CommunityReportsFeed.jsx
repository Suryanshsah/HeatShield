import { useState } from 'react';
import { confirmReport } from '../services/api';
import { AlertOctagon, AlertTriangle, CheckCircle2, Clock, Compass, Droplets, MapPin, ThumbsUp, Wind, Wrench } from 'lucide-react';

export default function CommunityReportsFeed({ reports = [], onReportConfirmed, t }) {
  const [catFilter, setCatFilter] = useState('all'); // all | water | heat | safety
  const [statusFilter, setStatusFilter] = useState('all'); // all | new | in-progress | resolved
  const [sortBy, setSortBy] = useState('urgent'); // urgent | newest | confirmed

  const [confirmCounts, setConfirmCounts] = useState({});

  async function handleConfirm(e, rptId) {
    e.stopPropagation();
    const newCount = await confirmReport(rptId);
    setConfirmCounts(prev => ({ ...prev, [rptId]: newCount }));
    if (onReportConfirmed) onReportConfirmed(rptId, newCount);
  }

  // Filter logic
  let list = reports.filter((r) => {
    const matchCat = catFilter === 'all' || r.category === catFilter;
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchCat && matchStatus;
  });

  // Sort logic
  list.sort((a, b) => {
    if (sortBy === 'urgent') {
      const weight = { urgent: 3, serious: 2, minor: 1 };
      return (weight[b.urgency] || 0) - (weight[a.urgency] || 0);
    }
    if (sortBy === 'confirmed') {
      const countA = confirmCounts[a.id] || a.confirmations || 0;
      const countB = confirmCounts[b.id] || b.confirmations || 0;
      return countB - countA;
    }
    // newest
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const categoryIcons = {
    water: Droplets,
    heat: Wind,
    safety: AlertTriangle,
  };

  const urgencyStyles = {
    urgent:  { label: 'Urgent',  bg: '#F9573818', text: '#F95738', border: '#F95738', icon: AlertOctagon },
    serious: { label: 'Serious', bg: '#EE964B18', text: '#EE964B', border: '#EE964B', icon: AlertTriangle },
    minor:   { label: 'Minor',   bg: 'var(--brand-aqua-light)', text: 'var(--brand-aqua-dark)', border: '#6FD3B8', icon: Clock },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {t.communityFeedTitle}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Verified neighborhood reports &amp; confirmations
          </p>
        </div>

        {/* Sort selector */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <option value="urgent">{t.sortUrgent}</option>
          <option value="newest">{t.sortNewest}</option>
          <option value="confirmed">{t.sortConfirmed}</option>
        </select>
      </div>

      {/* Filter Chips & Status Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        {/* Category filters */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'water', label: 'Water' },
            { id: 'heat', label: 'Heat' },
            { id: 'safety', label: 'Safety' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCatFilter(cat.id)}
              style={{
                padding: '5px 12px',
                borderRadius: 99,
                border: catFilter === cat.id ? 'none' : '1px solid var(--border-color)',
                backgroundColor: catFilter === cat.id ? '#6FD3B8' : 'var(--bg-surface)',
                color: catFilter === cat.id ? '#07201F' : 'var(--text-sub)',
                fontWeight: catFilter === cat.id ? 800 : 600,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status filters */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'all', label: t.filterStatusAll },
            { id: 'new', label: t.filterStatusNew },
            { id: 'in-progress', label: t.filterStatusInProgress },
            { id: 'resolved', label: t.filterStatusResolved },
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                border: statusFilter === st.id ? '1px solid #6FD3B8' : '1px solid transparent',
                backgroundColor: statusFilter === st.id ? 'var(--brand-aqua-light)' : 'transparent',
                color: statusFilter === st.id ? 'var(--brand-aqua-dark)' : 'var(--text-muted)',
                fontWeight: statusFilter === st.id ? 800 : 600,
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {list.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🌱</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.emptyReports}</div>
        </div>
      ) : (
        /* Report Cards List */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map((rpt) => {
            const IconComp = categoryIcons[rpt.category] || AlertTriangle;
            const urg = urgencyStyles[rpt.urgency] || urgencyStyles.serious;
            const UrgIcon = urg.icon;
            const currentConfirmations = confirmCounts[rpt.id] ?? rpt.confirmations ?? 1;

            return (
              <div
                key={rpt.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Header: Title + Urgency Pill + Status */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      color: '#6FD3B8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <IconComp size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        {rpt.title}
                      </h4>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <MapPin size={11} /> {rpt.locationName}
                        </span>
                        <span>·</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Clock size={11} /> {rpt.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Urgency Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '3px 9px',
                    borderRadius: 99,
                    backgroundColor: urg.bg,
                    color: urg.text,
                    border: `1px solid ${urg.border}`,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}>
                    <UrgIcon size={12} />
                    <span>{urg.label}</span>
                  </div>
                </div>

                {/* Description */}
                {rpt.description && (
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-sub)', lineHeight: 1.45 }}>
                    {rpt.description}
                  </p>
                )}

                {/* Footer Actions: Confirm "I see this too" button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 6,
                  borderTop: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={13} color="#6FD3B8" />
                    <span>ID: {rpt.id}</span>
                  </div>

                  <button
                    onClick={(e) => handleConfirm(e, rpt.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 14px',
                      borderRadius: 99,
                      backgroundColor: 'var(--brand-aqua-light)',
                      color: 'var(--brand-aqua-dark)',
                      border: '1px solid #6FD3B8',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'transform var(--transition-fast)',
                    }}
                  >
                    <ThumbsUp size={13} />
                    <span>{t.confirmBtn} ({currentConfirmations})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
