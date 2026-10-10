import { CircleMarker, Popup } from 'react-leaflet';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  operational: {
    color: '#00a896',
    label: 'Operational',
    icon: CheckCircle2,
    badgeBg: '#e0f7f5',
    badgeText: '#007a6e',
  },
  'low-supply': {
    color: '#d97706',
    label: 'Low Supply',
    icon: AlertCircle,
    badgeBg: '#fef3c7',
    badgeText: '#92400e',
  },
  broken: {
    color: '#dc2626',
    label: 'Broken / Out of Water',
    icon: XCircle,
    badgeBg: '#fee2e2',
    badgeText: '#991b1b',
  },
};

export default function WaterPointMarkers({ waterPoints = [] }) {
  return waterPoints.map((wp) => {
    const config = STATUS_CONFIG[wp.status] || STATUS_CONFIG.operational;
    const IconComponent = config.icon;

    return (
      <CircleMarker
        key={wp.id}
        center={[wp.lat, wp.lng]}
        radius={9}
        pathOptions={{
          color: '#ffffff',
          weight: 2.5,
          fillColor: config.color,
          fillOpacity: 0.95,
        }}
      >
        <Popup>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', padding: '4px 2px', minWidth: 170 }}>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0d1f23', marginBottom: 4 }}>
              {wp.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#557078', marginBottom: 8 }}>
              Type: {wp.type}
            </div>

            {/* Paired Icon + Label Status Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 9px',
              borderRadius: 99,
              backgroundColor: config.badgeBg,
              color: config.badgeText,
              fontSize: '0.76rem',
              fontWeight: 700,
              border: `1px solid ${config.color}40`,
            }}>
              <IconComponent size={13} strokeWidth={2.5} />
              <span>{config.label}</span>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#888888', marginTop: 8 }}>
              Coords: {wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}
            </div>
          </div>
        </Popup>
      </CircleMarker>
    );
  });
}
