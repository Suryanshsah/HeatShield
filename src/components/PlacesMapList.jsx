import { useEffect, useState } from 'react';
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import RadiusSelector from './RadiusSelector';
import WaterPointCard from './WaterPointCard';
import WaterStatusBadge from './WaterStatusBadge';
import { AlertTriangle, CheckCircle, ChevronRight, Compass, Droplets, MapPin, Navigation, Shield, Sun, Trees, Wind, X } from 'lucide-react';
import L from 'leaflet';

// Fix leaflet marker assets
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapFlyToController({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo(target, 14, { duration: 1.2 });
    }
  }, [target, map]);
  return null;
}

export default function PlacesMapList({
  places = [],
  waterPoints = [],
  reports = [],
  userLocation = { lat: 28.6139, lng: 77.2090 },
  radius = 1000,
  setRadius,
  heatRiskLevel = 'High',
  onConfirmWaterStatus,
  t,
}) {
  const [filter, setFilter] = useState('all'); // all | water | cooling | shade
  const [waterAvailableOnly, setWaterAvailableOnly] = useState(false);
  const [showReportsOnMap, setShowReportsOnMap] = useState(false);
  const [flyTarget, setFlyTarget] = useState(null);
  const [activePlace, setActivePlace] = useState(null);

  const userCenter = [userLocation.lat, userLocation.lng];

  // Filtered water points
  const filteredWaterPoints = waterPoints.filter((wp) => {
    if (waterAvailableOnly && wp.status !== 'Available') return false;
    return true;
  });

  const nearestWorkingWater = filteredWaterPoints.find(wp => wp.status === 'Available');

  function handleWaterPointClick(wp) {
    setActivePlace({ ...wp, isWaterPoint: true });
    setFlyTarget([wp.lat, wp.lng]);
  }

  function handleLocateMe() {
    setFlyTarget(userCenter);
  }

  const statusColors = {
    Available: '#6FD3B8',
    'Low flow': '#EE964B',
    'Not working': '#F95738',
    Unknown: '#94a3b8',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── High / Extreme Heat Smart Suggestion Banner ── */}
      {(heatRiskLevel === 'High' || heatRiskLevel === 'Extreme') && nearestWorkingWater && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--brand-aqua-light)',
          border: '1.5px solid #6FD3B8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#6FD3B8', color: '#07201F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Droplets size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-aqua-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Smart Hydration Suggestion
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                Nearest working water: {nearestWorkingWater.name} ({nearestWorkingWater.distanceLabel} · {nearestWorkingWater.walkTime})
              </div>
            </div>
          </div>

          <button
            onClick={() => handleWaterPointClick(nearestWorkingWater)}
            style={{
              padding: '8px 18px',
              borderRadius: 99,
              backgroundColor: '#6FD3B8',
              color: '#07201F',
              fontWeight: 800,
              fontSize: '0.82rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Go there →
          </button>
        </div>
      )}

      {/* Filter Chips & Radius Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
      }}>
        {/* Category & Water Available Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all',     label: t.filterAll,     icon: Compass },
            { id: 'water',   label: t.filterWater,   icon: Droplets },
            { id: 'cooling', label: t.filterCooling, icon: Wind },
            { id: 'shade',   label: t.filterShade,   icon: Trees },
          ].map(({ id, label, icon: ChipIcon }) => {
            const active = filter === id;
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 99,
                  border: active ? 'none' : '1px solid var(--border-color)',
                  backgroundColor: active ? '#6FD3B8' : 'var(--bg-surface)',
                  color: active ? '#07201F' : 'var(--text-sub)',
                  fontWeight: active ? 800 : 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <ChipIcon size={14} />
                <span>{label}</span>
              </button>
            );
          })}

          {/* Water Available Now Toggle Chip */}
          <button
            onClick={() => setWaterAvailableOnly(!waterAvailableOnly)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 12px',
              borderRadius: 99,
              border: waterAvailableOnly ? '1px solid #6FD3B8' : '1px solid var(--border-color)',
              backgroundColor: waterAvailableOnly ? 'var(--brand-aqua-light)' : 'var(--bg-surface)',
              color: waterAvailableOnly ? 'var(--brand-aqua-dark)' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <CheckCircle size={13} />
            <span>Water available now</span>
          </button>
        </div>

        {/* Radius Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Radius:</span>
          <RadiusSelector radius={radius} setRadius={setRadius} />
        </div>
      </div>

      {/* ── Interactive Leaflet Map Box ── */}
      <div style={{
        position: 'relative',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Map info label */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 400,
          backgroundColor: 'var(--bg-surface)',
          padding: '6px 12px',
          borderRadius: 99,
          border: '1px solid var(--border-color)',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          pointerEvents: 'none',
        }}>
          {t.illustrativeMapLabel}
        </div>

        {/* Locate me button */}
        <button
          onClick={handleLocateMe}
          title="Locate me"
          style={{
            position: 'absolute',
            bottom: 14,
            right: 14,
            zIndex: 400,
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            color: '#6FD3B8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <Navigation size={18} />
        </button>

        <MapContainer
          center={userCenter}
          zoom={13}
          style={{ height: 400, width: '100%' }}
          scrollWheelZoom={false}
          zoomControl={false}
        >
          <ZoomControl position="topright" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapFlyToController target={flyTarget} />

          {/* User Location Pulsing Dot */}
          <CircleMarker
            center={userCenter}
            radius={9}
            pathOptions={{ color: '#ffffff', fillColor: '#6FD3B8', fillOpacity: 1, weight: 3 }}
          >
            <Popup>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#07201F' }}>
                📍 Your Location
              </div>
            </Popup>
          </CircleMarker>

          {/* Soft Radius Circle */}
          <Circle
            center={userCenter}
            radius={radius}
            pathOptions={{ color: '#6FD3B8', fillColor: '#6FD3B8', fillOpacity: 0.08, weight: 1.5, dashArray: '4,6' }}
          />

          {/* Real-time Water Point Pins with Status Rings */}
          {filteredWaterPoints.map((wp) => {
            const color = statusColors[wp.status] || '#94a3b8';
            return (
              <CircleMarker
                key={wp.id}
                center={[wp.lat, wp.lng]}
                radius={11}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.85,
                  weight: 3,
                }}
                eventHandlers={{
                  click: () => handleWaterPointClick(wp),
                }}
              >
                <Popup>
                  <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', padding: '2px 4px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#07201F' }}>
                      💧 {wp.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#557078', margin: '3px 0' }}>
                      Status: <strong>{wp.status}</strong> · {wp.distanceLabel}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Selected Water Point Detail Drawer */}
      {activePlace && activePlace.isWaterPoint && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setActivePlace(null)}
            style={{ position: 'absolute', top: 12, right: 12, zIndex: 5, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
          <WaterPointCard
            waterPoint={activePlace}
            onConfirmStatus={onConfirmWaterStatus}
            t={t}
          />
        </div>
      )}

      {/* Empty State when no working water points in radius */}
      {filteredWaterPoints.length === 0 && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}>
          <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>💧</div>
          <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', marginBottom: 4 }}>
            No working water points within {radius >= 1000 ? `${radius / 1000} km` : `${radius} m`}.
          </h4>
          <p style={{ fontSize: '0.82rem', marginBottom: 16 }}>
            Try choosing a larger search radius or check a nearby community cooling centre.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              onClick={() => setRadius(2000)}
              style={{ padding: '8px 16px', borderRadius: 99, backgroundColor: '#6FD3B8', color: '#07201F', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Expand to 2 km
            </button>
            <button
              onClick={() => setFilter('cooling')}
              style={{ padding: '8px 16px', borderRadius: 99, backgroundColor: 'var(--bg-surface-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Show Cooling Centres
            </button>
          </div>
        </div>
      )}

      {/* List of Water Points */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredWaterPoints.map((wp) => (
          <WaterPointCard
            key={wp.id}
            waterPoint={wp}
            onConfirmStatus={onConfirmWaterStatus}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}
