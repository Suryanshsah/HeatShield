import { CircleMarker, Marker, Popup } from 'react-leaflet';
import { ThumbsUp } from 'lucide-react';
import { upvoteReport } from '../services/api';

const STATUS_COLORS = {
  operational: '#52b788',
  'low-supply': '#f4a261',
  broken:       '#d62828',
};

const STATUS_LABELS = {
  operational: 'Operational',
  'low-supply': 'Low Supply',
  broken:       'Broken',
};

export function WaterPointMarkers({ waterPoints = [] }) {
  return waterPoints.map((wp) => {
    const color = STATUS_COLORS[wp.status] || '#888';
    return (
      <CircleMarker
        key={wp.id}
        center={[wp.lat, wp.lng]}
        radius={8}
        pathOptions={{
          color: '#fff',
          weight: 2,
          fillColor: color,
          fillOpacity: 0.9,
        }}
      >
        <Popup>
          <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 170 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>💧 {wp.name}</div>
            <div style={{ fontSize: '0.78rem', color: '#555', marginBottom: 4 }}>{wp.type}</div>
            {wp.address && (
              <div style={{ fontSize: '0.72rem', color: '#666', marginBottom: 6 }}>📍 {wp.address}</div>
            )}
            <div style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 99,
              fontSize: '0.72rem',
              fontWeight: 600,
              backgroundColor: `${color}22`,
              color: color,
              border: `1px solid ${color}`,
            }}>
              {STATUS_LABELS[wp.status]}
            </div>
          </div>
        </Popup>
      </CircleMarker>
    );
  });
}

export function ReportMarkers({ reports = [], onUpvote }) {
  return reports.map((rpt) => {
    const isBroken = rpt.issueType === 'broken-tap' || rpt.issueType === 'leaking-pipe';
    const color = rpt.status === 'resolved' ? '#52b788' : isBroken ? '#c1121f' : '#e76f51';

    return (
      <CircleMarker
        key={rpt.id}
        center={[rpt.lat, rpt.lng]}
        radius={7}
        pathOptions={{
          color: '#fff',
          weight: 2,
          fillColor: color,
          fillOpacity: 0.85,
        }}
      >
        <Popup>
          <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 180 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color, marginBottom: 2 }}>
              🚨 {rpt.issueType?.replace('-', ' ')?.toUpperCase()}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#333', marginBottom: 6, lineHeight: 1.4 }}>
              {rpt.description}
            </div>
            {rpt.address && (
              <div style={{ fontSize: '0.72rem', color: '#666', marginBottom: 6 }}>
                📍 {rpt.address}
              </div>
            )}
            {rpt.photoUrl && (
              <img src={rpt.photoUrl} alt="Report attachment" style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 6 }} />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color }}>
                Status: {rpt.status}
              </span>
              <button
                onClick={async () => {
                  await upvoteReport(rpt.id);
                  if (onUpvote) onUpvote();
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '2px 7px', borderRadius: 99,
                  border: '1px solid #ccc', backgroundColor: '#fff',
                  cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700,
                }}
              >
                <ThumbsUp size={10} color="#2d6a4f" /> {rpt.upvotes || 0}
              </button>
            </div>
          </div>
        </Popup>
      </CircleMarker>
    );
  });
}
