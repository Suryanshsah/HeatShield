import { CircleMarker, Popup } from 'react-leaflet';

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

export default function WaterPointMarkers({ waterPoints = [] }) {
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
          <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 160 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{wp.name}</div>
            <div style={{ fontSize: '0.8rem', color: '#555', marginBottom: 4 }}>{wp.type}</div>
            <div style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 99,
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: `${color}22`,
              color: color,
              border: `1px solid ${color}`,
            }}>
              {STATUS_LABELS[wp.status]}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#888', marginTop: 6 }}>
              {wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}
            </div>
          </div>
        </Popup>
      </CircleMarker>
    );
  });
}
