import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Droplets, MapPin, Search, ThumbsUp, Wrench, X } from 'lucide-react';
import { upvoteReport } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const ISSUE_META = {
  'broken-tap':          { icon: Wrench,        color: '#c1121f', bg: '#fde8e8' },
  'water-unavailable':   { icon: Droplets,      color: '#e76f51', bg: '#fdeee9' },
  'leaking-pipe':        { icon: AlertTriangle, color: '#d4760a', bg: '#fef3e6' },
  'cooling-unavailable': { icon: AlertTriangle, color: '#7b5ea7', bg: '#f2eef9' },
};

const STATUS_BADGE = {
  open:         { bg: '#fde8e8', color: '#c1121f', dot: '#c1121f' },
  acknowledged: { bg: '#fef3e6', color: '#d4760a', dot: '#f4a261' },
  resolved:     { bg: '#e8f7ef', color: '#2d6a4f', dot: '#52b788' },
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

export default function RecentReports({ reports = [], onReportUpdated }) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const getIssueLabel = (type) => {
    switch (type) {
      case 'broken-tap': return t('brokenTap');
      case 'water-unavailable': return t('waterUnavailable');
      case 'leaking-pipe': return t('leakingPipe');
      case 'cooling-unavailable': return t('coolingUnavailable');
      default: return type;
    }
  };

  const getStatusLabel = (st) => {
    switch (st) {
      case 'open': return t('open');
      case 'acknowledged': return t('inReview');
      case 'resolved': return t('resolved');
      default: return st;
    }
  };

  async function handleUpvote(e, rptId) {
    e.stopPropagation();
    try {
      const updated = await upvoteReport(rptId);
      if (onReportUpdated) onReportUpdated(updated);
    } catch (err) {
      console.warn('Upvote failed:', err);
    }
  }

  const filtered = reports.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q ||
      r.description?.toLowerCase().includes(q) ||
      r.address?.toLowerCase().includes(q) ||
      r.issueType?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{
      backgroundColor: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
    }}>
      {/* Header with Search & Filter */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(to right, var(--border-lt), var(--card))',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
            📋 {t('recentReports')}
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: '#fde8e8',
              color: '#c1121f',
              padding: '2px 8px',
              borderRadius: 99,
            }}>
              {reports.filter(r => r.status === 'open').length} {t('open')}
            </span>
          </h2>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 4, backgroundColor: 'var(--border-lt)', padding: 3, borderRadius: 8 }}>
            {['all', 'open', 'acknowledged', 'resolved'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: statusFilter === st ? 700 : 500,
                  backgroundColor: statusFilter === st ? '#fff' : 'transparent',
                  color: statusFilter === st ? 'var(--forest-dk)' : 'var(--muted)',
                  cursor: 'pointer',
                  boxShadow: statusFilter === st ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  textTransform: 'capitalize',
                }}
              >
                {st === 'all' ? t('allStatus') : getStatusLabel(st)}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative' }}>
          <Search size={15} color="var(--muted)" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              fontSize: '0.84rem',
              outline: 'none',
              backgroundColor: '#fff',
            }}
          />
        </div>
      </div>

      {/* Reports List */}
      {filtered.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📭</div>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>No reports matching your search/filter.</p>
        </div>
      ) : (
        <ul style={{ listStyle: 'none' }}>
          {filtered.map((rpt, i) => {
            const meta  = ISSUE_META[rpt.issueType] || { icon: AlertTriangle, color: '#888', bg: '#f5f5f5' };
            const badge = STATUS_BADGE[rpt.status]  || STATUS_BADGE.open;
            const IssueIcon = meta.icon;

            return (
              <li
                key={rpt.id}
                style={{
                  padding: '1rem 1.25rem',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border-lt)' : 'none',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fcfdfd'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Icon */}
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: meta.bg,
                  border: `1px solid ${meta.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <IssueIcon size={18} color={meta.color} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>{getIssueLabel(rpt.issueType)}</span>
                      
                      {/* Status badge */}
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
                      }}>
                        <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', backgroundColor: badge.dot }} />
                        {getStatusLabel(rpt.status)}
                      </span>
                    </div>

                    {/* Community Upvote Button */}
                    <button
                      onClick={e => handleUpvote(e, rpt.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '3px 10px',
                        borderRadius: 99,
                        border: '1px solid var(--border)',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--forest-dk)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      }}
                    >
                      <ThumbsUp size={12} color="var(--forest)" />
                      {rpt.upvotes || 0} {t('upvotes')}
                    </button>
                  </div>

                  <p style={{
                    fontSize: '0.84rem',
                    color: 'var(--text-md)',
                    lineHeight: 1.5,
                    marginBottom: 6,
                  }}>
                    {rpt.description}
                  </p>

                  {/* Location & Time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.74rem', color: 'var(--muted)', flexWrap: 'wrap' }}>
                    {rpt.address && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--forest-dk)', fontWeight: 600 }}>
                        <MapPin size={11} color="var(--forest)" />
                        {rpt.address}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={11} />
                      {timeAgo(rpt.timestamp)}
                    </span>
                  </div>

                  {/* Official Response Note */}
                  {rpt.officialNote && (
                    <div style={{
                      marginTop: 8,
                      padding: '8px 12px',
                      backgroundColor: '#e8f7ef',
                      borderLeft: '3px solid #52b788',
                      borderRadius: 6,
                      fontSize: '0.78rem',
                      color: '#1b4332',
                    }}>
                      <strong>🏛️ {t('officialResponse')}:</strong> {rpt.officialNote}
                    </div>
                  )}

                  {/* Attached Photo Thumbnail */}
                  {rpt.photoUrl && (
                    <div style={{ marginTop: 8 }}>
                      <img
                        src={rpt.photoUrl}
                        alt="Incident attachment"
                        onClick={() => setSelectedPhoto(rpt.photoUrl)}
                        style={{
                          width: 60, height: 60, objectFit: 'cover', borderRadius: 6,
                          border: '1px solid var(--border)', cursor: 'pointer'
                        }}
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Lightbox Modal for Photo viewing */}
      {selectedPhoto && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
        }} onClick={() => setSelectedPhoto(null)}>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <img src={selectedPhoto} alt="Enlarged preview" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 12 }} />
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute', top: -12, right: -12,
                backgroundColor: '#fff', border: 'none', borderRadius: '50%',
                width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
