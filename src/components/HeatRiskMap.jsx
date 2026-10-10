import { MapContainer, Rectangle, TileLayer } from 'react-leaflet';
import { SAMPLE_HEAT_ZONES } from '../data/sampleData';
import WaterPointMarkers from './WaterPointMarkers';

const DELHI_CENTER = [28.6139, 77.2090];

export default function HeatRiskMap({ waterPoints = [] }) {
  return (
    <div style={{
      backgroundColor: 'var(--color-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>
          Delhi — Heat Risk & Water Access Map
        </h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>
          Sample data only
        </span>
      </div>

      <MapContainer
        id="heat-risk-map"
        center={DELHI_CENTER}
        zoom={11}
        style={{ height: 420, width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Heat risk zone rectangles */}
        {SAMPLE_HEAT_ZONES.map((zone) => (
          <Rectangle
            key={zone.id}
            bounds={zone.bounds}
            pathOptions={{
              color: zone.colour,
              weight: 1,
              fillColor: zone.colour,
              fillOpacity: 0.22,
            }}
          />
        ))}

        {/* Water point markers */}
        <WaterPointMarkers waterPoints={waterPoints} />
      </MapContainer>

      {/* Water marker key */}
      <div style={{ padding: '0.75rem 1.25rem', display: 'flex', gap: 16, flexWrap: 'wrap', borderTop: '1px solid var(--color-border)' }}>
        {[
          { color: '#52b788', label: 'Operational' },
          { color: '#f4a261', label: 'Low Supply' },
          { color: '#d62828', label: 'Broken' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-muted)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
