import { useState } from 'react';
import LiveTempChip from './LiveTempChip';
import WaterStatusBadge from './WaterStatusBadge';
import { Accessibility, Check, Clock, Droplets, MapPin, Navigation, Share2, ThumbsDown, ThumbsUp, X } from 'lucide-react';

export default function WaterPointCard({ waterPoint, onConfirmStatus, onReportIssue, t }) {
  const [toastMsg, setToastMsg] = useState('');

  async function handleConfirm(newStatus) {
    if (onConfirmStatus) {
      await onConfirmStatus(waterPoint.id, newStatus);
      setToastMsg(`Thank you! Status updated to "${newStatus}".`);
      setTimeout(() => setToastMsg(''), 3000);
    }
  }

  function handleShare() {
    const shareData = {
      title: `${waterPoint.name} — HeatShield Water Access`,
      text: `Drinking water point at ${waterPoint.name} (${waterPoint.distanceLabel} away, status: ${waterPoint.status}).`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareData.title}: ${shareData.text}`);
      setToastMsg('Link copied to clipboard!');
      setTimeout(() => setToastMsg(''), 3000);
    }
  }

  function handleDirections() {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${waterPoint.lat},${waterPoint.lng}`;
    window.open(mapsUrl, '_blank');
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      position: 'relative',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'absolute',
          top: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#6FD3B8',
          color: '#07201F',
          padding: '4px 14px',
          borderRadius: 99,
          fontSize: '0.75rem',
          fontWeight: 800,
          boxShadow: '0 4px 12px rgba(111, 211, 184, 0.4)',
          zIndex: 10,
        }} className="animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* Header: Name + Status Badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {waterPoint.name}
            </h3>
            {waterPoint.accessibility && (
              <span title="Step-free wheelchair accessible" style={{ color: '#6FD3B8', display: 'flex' }}>
                <Accessibility size={16} />
              </span>
            )}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>{waterPoint.typeName}</span>
            <span>·</span>
            <span>🕒 {waterPoint.openHours}</span>
            <span>·</span>
            <span>{waterPoint.isFree ? 'Free Access' : 'Paid'}</span>
          </div>
        </div>

        <WaterStatusBadge
          status={waterPoint.status}
          reportedByNeighbours={waterPoint.reportedByNeighbours}
        />
      </div>

      {/* Distance & Confirmed info row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: '0.8rem', color: 'var(--text-sub)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
            📍 {waterPoint.distanceLabel}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>({waterPoint.walkTime})</span>
        </div>

        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={12} />
          <span>Confirmed {waterPoint.timeAgoLabel} by {waterPoint.confirmations} neighbours</span>
        </div>
      </div>

      {/* Live Temp Chip */}
      <div>
        <LiveTempChip lat={waterPoint.lat} lng={waterPoint.lng} />
      </div>

      {/* Notes */}
      {waterPoint.notes && (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', lineHeight: 1.4 }}>
          {waterPoint.notes}
        </p>
      )}

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
        paddingTop: 10,
        borderTop: '1px solid var(--border-subtle)',
      }}>
        {/* Quick Confirm Buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => handleConfirm('Available')}
            title="Confirm water is working"
            style={{
              padding: '6px 12px',
              borderRadius: 99,
              backgroundColor: 'var(--brand-aqua-light)',
              color: 'var(--brand-aqua-dark)',
              border: '1px solid #6FD3B8',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <ThumbsUp size={12} /> Working
          </button>
          <button
            onClick={() => handleConfirm('Not working')}
            title="Mark water as not working"
            style={{
              padding: '6px 12px',
              borderRadius: 99,
              backgroundColor: 'rgba(249, 87, 56, 0.12)',
              color: '#F95738',
              border: '1px solid #F95738',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <ThumbsDown size={12} /> Not working
          </button>
        </div>

        {/* Directions + Share Buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={handleShare}
            title="Share water point"
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <Share2 size={14} />
          </button>
          <button
            onClick={handleDirections}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#6FD3B8',
              color: '#07201F',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Navigation size={13} /> Get directions
          </button>
        </div>
      </div>
    </div>
  );
}
