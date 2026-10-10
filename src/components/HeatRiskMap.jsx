import { MapContainer, Rectangle, TileLayer, ZoomControl } from 'react-leaflet';
import { SAMPLE_HEAT_ZONES } from '../data/sampleData';
import WaterPointMarkers from './WaterPointMarkers';

const DELHI_CENTER = [28.6139, 77.2090];

export default function HeatRiskMap({ waterPoints = [] }) {
  return (
    <div style={{
      backgroundColor: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Map header */}
      <div style={{
        padding: '0.9rem 1.25rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to right, var(--border-lt), var(--card))',
      }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>
            🗺 Delhi — Heat Risk &amp; Water Access Map
          </h2>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 1 }}>
            Click a marker to view details · {waterPoints.length} water points tracked
          </p>
        </div>
        <span style={{
          padding: '3px 10px',
          borderRadius: 99,
          fontSize: '0.68rem',
          fontWeight: 700,
          backgroundColor: '#fef3e6',
          color: '#d4760a',
          border: '1px solid #f4a26133',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          Sample Data
        </span>
      </div>

      {/* Leaflet map */}
      <MapContainer
        id="heat-risk-map"
        center={DELHI_CENTER}
        zoom={11}
        style={{ height: 430, width: '100%' }}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Heat risk zone overlays */}
        {SAMPLE_HEAT_ZONES.map((zone) => (
          <Rectangle
            key={zone.id}
            bounds={zone.bounds}
            pathOptions={{
              color: zone.colour,
              weight: 1.5,
              fillColor: zone.colour,
              fillOpacity: 0.18,
              dashArray: '4 3',
            }}
          />
        ))}

        <WaterPointMarkers waterPoints={waterPoints} />
      </MapContainer>

      {/* Footer key */}
      <div style={{
        padding: '0.65rem 1.25rem',
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        alignItems: 'center',
        borderTop: '1px solid var(--border)',
        background: 'var(--border-lt)',
      }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Water Points:
        </span>
        {[
          { color: '#52b788', label: 'Operational' },
          { color: '#f4a261', label: 'Low Supply' },
          { color: '#c1121f', label: 'Broken' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: 'var(--text-md)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 0 2px ${color}40` }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
