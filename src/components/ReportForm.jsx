import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { submitReport } from '../services/api';
import L from 'leaflet';

// Fix default Leaflet icon in Vite/webpack environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ISSUE_TYPES = [
  { value: 'broken-tap',          label: 'Broken Water Tap' },
  { value: 'water-unavailable',   label: 'Water Unavailable' },
  { value: 'leaking-pipe',        label: 'Leaking Pipe' },
  { value: 'cooling-unavailable', label: 'Cooling Facility Unavailable' },
];

const DELHI_CENTER = [28.6139, 77.2090];

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  fontSize: '0.9rem',
  color: 'var(--color-text)',
  backgroundColor: '#fff',
  outline: 'none',
  fontFamily: 'inherit',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: 600,
  color: 'var(--color-muted)',
  marginBottom: 5,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

function LocationPicker({ onPick }) {
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
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [pickerMarker, setPickerMarker] = useState(null);
  const fileRef = useRef();

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.issueType)   e.issueType   = 'Please select an issue type.';
    if (!form.description.trim()) e.description = 'Please enter a description.';
    if (!form.lat || isNaN(Number(form.lat))) e.lat = 'Enter a valid latitude.';
    if (!form.lng || isNaN(Number(form.lng))) e.lng = 'Enter a valid longitude.';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('submitting');
    try {
      const result = await submitReport({
        issueType:   form.issueType,
        description: form.description,
        lat:         parseFloat(form.lat),
        lng:         parseFloat(form.lng),
        photo:       form.photo,
      });
      setStatus('success');
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Submission failed. Please try again.');
    }
  }

  function handleReset() {
    setForm({ issueType: '', description: '', lat: '', lng: '', photo: null });
    setErrors({});
    setStatus('idle');
    setErrorMsg('');
    setPickerMarker(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  if (status === 'success') {
    return (
      <div style={{
        backgroundColor: '#e6f4ec',
        border: '1px solid #52b788',
        borderRadius: 12,
        padding: '2rem',
        textAlign: 'center',
        maxWidth: 560,
        margin: '0 auto',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✅</div>
        <h2 style={{ fontWeight: 700, color: 'var(--color-forest)', marginBottom: 8 }}>Report Submitted</h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: 16 }}>
          Your report has been saved locally. Once the AWS backend is connected, it will be sent to the team automatically.
        </p>
        <button
          id="report-submit-another"
          onClick={handleReset}
          style={{
            padding: '10px 24px',
            backgroundColor: 'var(--color-forest)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <form
      id="report-form"
      onSubmit={handleSubmit}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 600 }}
    >
      {/* Issue Type */}
      <div>
        <label htmlFor="issue-type" style={labelStyle}>Issue Type *</label>
        <select
          id="issue-type"
          value={form.issueType}
          onChange={(e) => set('issueType', e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          <option value="">— Select an issue —</option>
          {ISSUE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        {errors.issueType && <p style={{ color: '#d62828', fontSize: '0.78rem', marginTop: 4 }}>{errors.issueType}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" style={labelStyle}>Description *</label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe the problem as clearly as possible…"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
        />
        {errors.description && <p style={{ color: '#d62828', fontSize: '0.78rem', marginTop: 4 }}>{errors.description}</p>}
      </div>

      {/* Coordinates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label htmlFor="latitude" style={labelStyle}>Latitude *</label>
          <input
            id="latitude"
            type="number"
            step="any"
            placeholder="e.g. 28.6139"
            value={form.lat}
            onChange={(e) => set('lat', e.target.value)}
            style={inputStyle}
          />
          {errors.lat && <p style={{ color: '#d62828', fontSize: '0.78rem', marginTop: 4 }}>{errors.lat}</p>}
        </div>
        <div>
          <label htmlFor="longitude" style={labelStyle}>Longitude *</label>
          <input
            id="longitude"
            type="number"
            step="any"
            placeholder="e.g. 77.2090"
            value={form.lng}
            onChange={(e) => set('lng', e.target.value)}
            style={inputStyle}
          />
          {errors.lng && <p style={{ color: '#d62828', fontSize: '0.78rem', marginTop: 4 }}>{errors.lng}</p>}
        </div>
      </div>

      {/* Map picker toggle */}
      <div>
        <button
          type="button"
          id="toggle-map-picker"
          onClick={() => setShowMapPicker((v) => !v)}
          style={{
            padding: '7px 14px',
            border: '1px solid var(--color-forest)',
            borderRadius: 8,
            backgroundColor: 'transparent',
            color: 'var(--color-forest)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          {showMapPicker ? 'Hide Map' : '📍 Pick Location on Map'}
        </button>
        {showMapPicker && (
          <div style={{ marginTop: 10, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            <div style={{ padding: '6px 12px', backgroundColor: 'var(--color-offwhite)', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
              Click anywhere on the map to set coordinates.
            </div>
            <MapContainer
              id="location-picker-map"
              center={pickerMarker ? [pickerMarker[0], pickerMarker[1]] : DELHI_CENTER}
              zoom={11}
              style={{ height: 280 }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <LocationPicker onPick={(lat, lng) => {
                setPickerMarker([lat, lng]);
                set('lat', lat);
                set('lng', lng);
              }} />
              {pickerMarker && <Marker position={pickerMarker} />}
            </MapContainer>
          </div>
        )}
      </div>

      {/* Photo upload */}
      <div>
        <label htmlFor="photo-upload" style={labelStyle}>Photo (optional)</label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={(e) => set('photo', e.target.files[0] || null)}
          style={{ fontSize: '0.88rem', color: 'var(--color-muted)' }}
        />
        <p style={{ fontSize: '0.76rem', color: 'var(--color-muted)', marginTop: 4 }}>Accepted: JPG, PNG, WebP · Max 5 MB</p>
      </div>

      {/* Global error */}
      {status === 'error' && (
        <div style={{
          padding: '10px 14px',
          backgroundColor: '#fce4e4',
          border: '1px solid #d62828',
          borderRadius: 8,
          color: '#d62828',
          fontSize: '0.85rem',
        }}>
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <button
        id="submit-report-btn"
        type="submit"
        disabled={status === 'submitting'}
        style={{
          padding: '12px 28px',
          backgroundColor: status === 'submitting' ? '#aaa' : 'var(--color-forest)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
          fontWeight: 700,
          fontSize: '1rem',
          letterSpacing: '0.01em',
          alignSelf: 'flex-start',
        }}
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Report'}
      </button>

      <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: -8 }}>
        Reports are currently saved locally. AWS integration will send them to the response team.
      </p>
    </form>
  );
}
