import { useState } from 'react';
import { MapContainer, Rectangle, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import { SAMPLE_HEAT_ZONES } from '../data/sampleData';
import { ReportMarkers, WaterPointMarkers } from './WaterPointMarkers';
import { Search } from 'lucide-react';

const DELHI_CENTER = [28.6139, 77.2090];

function MapFlyTo({ center, zoom }) {
  const map = useMap();
  if (center) {
    map.flyTo(center, zoom || 13, { duration: 1.2 });
  }
  return null;
}

export default function HeatRiskMap({ waterPoints = [], reports = [], onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchErr('');

    try {
      const q = encodeURIComponent(`${searchQuery}, Delhi, India`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setMapCenter([lat, lon]);
      } else {
        setSearchErr('Location not found in Delhi.');
      }
    } catch (err) {
      setSearchErr('Search error. Try again.');
    } finally {
      setSearching(false);
    }
  }

  return (
    <div style={{
      backgroundColor: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Map header with locality search */}
      <div style={{
        padding: '0.9rem 1.25rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
        background: 'linear-gradient(to right, var(--border-lt), var(--card))',
      }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)' }}>
            🗺 Delhi — Interactive Heat Risk &amp; Water Access Map
          </h2>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 1 }}>
            Tracking {waterPoints.length} water points &amp; {reports.length} incident reports
          </p>
        </div>

        {/* Map Search Form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 6 }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} color="var(--muted)" style={{ position: 'absolute', left: 9, top: 8 }} />
            <input
              type="text"
              placeholder="Search area (e.g. CP, Saket)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                padding: '6px 10px 6px 28px',
                fontSize: '0.78rem',
                borderRadius: 6,
                border: '1px solid var(--border)',
                outline: 'none',
                width: 170,
              }}
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: 'var(--forest)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.76rem',
              cursor: searching ? 'wait' : 'pointer',
            }}
          >
            {searching ? '...' : 'Go'}
          </button>
        </form>
      </div>

      {searchErr && (
        <div style={{ padding: '4px 12px', backgroundColor: '#fde8e8', color: '#c1121f', fontSize: '0.75rem' }}>
          {searchErr}
        </div>
      )}

      {/* Leaflet map */}
      <MapContainer
        id="heat-risk-map"
        center={DELHI_CENTER}
        zoom={11}
        style={{ height: 440, width: '100%' }}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <MapFlyTo center={mapCenter} zoom={14} />

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
        <ReportMarkers reports={reports} onUpvote={onRefresh} />
      </MapContainer>

      {/* Footer key */}
      <div style={{
        padding: '0.65rem 1.25rem',
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        alignItems: 'center',
        borderTop: '1px solid var(--border)',
        background: 'var(--border-lt)',
      }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Legend:
        </span>
        {[
          { color: '#52b788', label: 'Operational / Resolved' },
          { color: '#f4a261', label: 'Low Supply / In Review' },
          { color: '#c1121f', label: 'Broken / Active Incident' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.76rem', color: 'var(--text-md)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 0 2px ${color}40` }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
