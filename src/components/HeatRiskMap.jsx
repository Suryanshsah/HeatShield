import { MapContainer, Rectangle, TileLayer, ZoomControl } from 'react-leaflet';
import { SAMPLE_HEAT_ZONES } from '../data/sampleData';
import WaterPointMarkers from './WaterPointMarkers';

const DELHI_CENTER = [28.6139, 77.2090];

export default function HeatRiskMap({ waterPoints = [] }) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Header bar */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
        backgroundColor: 'var(--bg-surface-subtle)',
      }}>
        <div>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Delhi Regional Heat &amp; Water Resource Map
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Heat risk zones overlaid with community water points
          </p>
        </div>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: 99,
          backgroundColor: 'var(--brand-aqua-light)',
          color: 'var(--brand-aqua-dark)',
          border: '1px solid var(--brand-aqua)',
        }}>
          {waterPoints.length} Water Points Active
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        id="heat-risk-map"
        center={DELHI_CENTER}
        zoom={11}
        style={{ height: 420, width: '100%' }}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <ZoomControl position="topright" />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Heat risk zone overlays (reserved heat colors) */}
        {SAMPLE_HEAT_ZONES.map((zone) => (
          <Rectangle
            key={zone.id}
            bounds={zone.bounds}
            pathOptions={{
              color: zone.color,
              weight: 1.5,
              fillColor: zone.color,
              fillOpacity: 0.2,
            }}
          />
        ))}

        <WaterPointMarkers waterPoints={waterPoints} />
      </MapContainer>

      {/* Footer Legend summary */}
      <div style={{
        padding: '0.75rem 1.25rem',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        fontSize: '0.78rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Water Status:</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--status-ok)' }}>
            ● Operational
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--status-warn)' }}>
            ● Low Supply
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--status-err)' }}>
            ● Broken
          </span>
        </div>
        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.72rem' }}>
          Tap markers to view details
        </span>
      </div>
    </div>
  );
}
