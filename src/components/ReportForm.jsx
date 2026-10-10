import { useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { submitReport } from '../services/api';
import { AlertCircle, AlertTriangle, Camera, CheckCircle2, Droplets, MapPin, Send, Wrench } from 'lucide-react';
import L from 'leaflet';

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ISSUE_OPTIONS = [
  { value: 'broken-tap', label: 'Broken Water Tap', icon: Wrench, description: 'Public tap broken, leaking, or damaged' },
  { value: 'water-unavailable', label: 'No Water Supply', icon: Droplets, description: 'Water source completely dry or shut off' },
  { value: 'leaking-pipe', label: 'Pipe Leak / Burst', icon: AlertTriangle, description: 'Main pipe leaking or wasting clean water' },
  { value: 'cooling-unavailable', label: 'Cooling Station Outage', icon: AlertCircle, description: 'Public misting shelter or cooler broken' },
];

const DELHI_CENTER = [28.6139, 77.2090];

function MapClickPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6));
    },
  });
  return null;
}

export default function ReportForm({ onSuccess }) {
  const [form, setForm] = useState({ issueType: '', description: '', lat: '', lng: '', photo: null });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [markerCoords, setMarkerCoords] = useState(null);
  const fileInputRef = useRef();

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.issueType) errs.issueType = 'Please select the type of problem.';
    if (!form.description.trim()) errs.description = 'Please describe what you observed.';
    if (!form.lat || isNaN(+form.lat)) errs.lat = 'Valid latitude is required.';
    if (!form.lng || isNaN(+form.lng)) errs.lng = 'Valid longitude is required.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrs = validate();
    if (Object.keys(validationErrs).length > 0) {
      setErrors(validationErrs);
      return;
    }

    setStatus('submitting');
    try {
      const result = await submitReport({
        issueType: form.issueType,
        description: form.description,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        photo: form.photo,
      });
      setStatus('success');
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Unable to submit report. Please try again.');
    }
  }

  function handleReset() {
    setForm({ issueType: '', description: '', lat: '', lng: '', photo: null });
    setErrors({});
    setStatus('idle');
    setErrorMsg('');
    setMarkerCoords(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // Outdoor high-contrast input styles
  const inputStyle = {
    width: '100%',
    minHeight: 48,
    padding: '12px 14px',
    border: '2px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.95rem',
    color: 'var(--text-main)',
    backgroundColor: 'var(--bg-surface)',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color var(--transition-fast)',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 800,
    color: 'var(--text-sub)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  if (status === 'success') {
    return (
      <div style={{
        padding: '2.5rem 1.5rem',
        backgroundColor: 'var(--status-ok-bg)',
        border: '2px solid var(--status-ok)',
        borderRadius: 'var(--radius-xl)',
        textAlign: 'center',
        maxWidth: 580,
        margin: '0 auto',
      }} className="animate-fade-in">
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'var(--status-ok)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <CheckCircle2 size={36} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
          Report Successfully Saved
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)', lineHeight: 1.5, marginBottom: 20 }}>
          Your water incident report has been recorded locally. It will automatically sync to community administrators when the AWS serverless backend is live.
        </p>
        <button
          onClick={handleReset}
          style={{
            minHeight: 48,
            padding: '12px 28px',
            backgroundColor: 'var(--brand-navy)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          Submit Another Problem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* 1. Issue Type Selection (Large thumb buttons) */}
      <div>
        <label style={labelStyle}>1. Select Water / Cooling Issue *</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          {ISSUE_OPTIONS.map(({ value, label, icon: Icon, description }) => {
            const selected = form.issueType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateField('issueType', value)}
                style={{
                  minHeight: 60,
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: selected ? '2px solid var(--brand-aqua)' : '2px solid var(--border-color)',
                  backgroundColor: selected ? 'var(--brand-aqua-light)' : 'var(--bg-surface)',
                  color: selected ? 'var(--brand-aqua-dark)' : 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: selected ? 'var(--brand-aqua)' : 'var(--bg-surface-subtle)',
                  color: selected ? '#0f2e35' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{label}</div>
                  <div style={{ fontSize: '0.74rem', opacity: 0.8 }}>{description}</div>
                </div>
              </button>
            );
          })}
        </div>
        {errors.issueType && (
          <div style={{ color: 'var(--status-err)', fontSize: '0.8rem', fontWeight: 700, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <AlertTriangle size={14} /> {errors.issueType}
          </div>
        )}
      </div>

      {/* 2. Description */}
      <div>
        <label htmlFor="description-field" style={labelStyle}>2. Problem Description *</label>
        <textarea
          id="description-field"
          rows={4}
          placeholder="Describe what is happening (e.g., tap handle broken, main road flooding, duration)..."
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }}
        />
        {errors.description && (
          <div style={{ color: 'var(--status-err)', fontSize: '0.8rem', fontWeight: 700, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <AlertTriangle size={14} /> {errors.description}
          </div>
        )}
      </div>

      {/* 3. Location (Lat / Lng + Map Picker) */}
      <div>
        <label style={labelStyle}>3. Incident Location (Coordinates) *</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <input
              type="number"
              step="any"
              placeholder="Latitude (e.g. 28.6139)"
              value={form.lat}
              onChange={(e) => updateField('lat', e.target.value)}
              style={inputStyle}
            />
            {errors.lat && (
              <div style={{ color: 'var(--status-err)', fontSize: '0.76rem', fontWeight: 700, marginTop: 4 }}>
                {errors.lat}
              </div>
            )}
          </div>
          <div>
            <input
              type="number"
              step="any"
              placeholder="Longitude (e.g. 77.2090)"
              value={form.lng}
              onChange={(e) => updateField('lng', e.target.value)}
              style={inputStyle}
            />
            {errors.lng && (
              <div style={{ color: 'var(--status-err)', fontSize: '0.76rem', fontWeight: 700, marginTop: 4 }}>
                {errors.lng}
              </div>
            )}
          </div>
        </div>

        {/* Toggle Map Picker Button */}
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          style={{
            minHeight: 44,
            padding: '8px 16px',
            border: '2px solid var(--brand-aqua)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: showMap ? 'var(--brand-aqua)' : 'transparent',
            color: showMap ? '#0f2e35' : 'var(--brand-aqua-dark)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <MapPin size={16} />
          {showMap ? 'Hide Map Picker' : '📍 Tap Location on Map'}
        </button>

        {showMap && (
          <div style={{ marginTop: 10, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--border-color)' }}>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface-subtle)', fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 600 }}>
              Tap anywhere on the map to set location coordinates.
            </div>
            <MapContainer
              center={markerCoords ? [markerCoords[0], markerCoords[1]] : DELHI_CENTER}
              zoom={11}
              style={{ height: 260, width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapClickPicker onPick={(lat, lng) => {
                setMarkerCoords([lat, lng]);
                updateField('lat', lat);
                updateField('lng', lng);
              }} />
              {markerCoords && <Marker position={markerCoords} />}
            </MapContainer>
          </div>
        )}
      </div>

      {/* 4. Optional Photo Attachment */}
      <div>
        <label style={labelStyle}>4. Photo Attachment (Optional)</label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          border: '2px dashed var(--border-color)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface-subtle)',
        }}>
          <Camera size={24} color="var(--text-muted)" />
          <div style={{ flex: 1 }}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => updateField('photo', e.target.files[0] || null)}
              style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}
            />
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Helps dispatch teams prioritize repairs (Max 5MB)
            </div>
          </div>
        </div>
      </div>

      {/* Submit Error */}
      {status === 'error' && (
        <div style={{
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--status-err-bg)',
          color: 'var(--status-err)',
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <AlertTriangle size={18} />
          {errorMsg}
        </div>
      )}

      {/* Submit Button (Thumb-reachable outdoor size) */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{
          minHeight: 52,
          padding: '14px 28px',
          backgroundColor: 'var(--brand-aqua)',
          color: '#0f2e35',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontWeight: 800,
          fontSize: '1rem',
          cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: '0 4px 14px rgba(0,168,150,0.35)',
          transition: 'transform var(--transition-fast)',
        }}
      >
        <Send size={18} />
        {status === 'submitting' ? 'Saving Report...' : 'Submit Incident Report'}
      </button>
    </form>
  );
}
