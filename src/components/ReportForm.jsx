import { useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { submitReport } from '../services/api';
import { AlertTriangle, Camera, CheckCircle, Droplets, MapPin, Navigation, Send, Wrench } from 'lucide-react';
import L from 'leaflet';

// Fix default markers in Vite builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ISSUE_TYPES = [
  { value: 'broken-tap',          label: 'Broken Water Tap',            icon: Wrench,        color: '#c1121f' },
  { value: 'water-unavailable',   label: 'Water Unavailable',           icon: Droplets,      color: '#e76f51' },
  { value: 'leaking-pipe',        label: 'Leaking Pipe',                icon: AlertTriangle, color: '#d4760a' },
  { value: 'cooling-unavailable', label: 'Cooling Facility Unavailable',icon: Navigation,    color: '#7b5ea7' },
];

const DELHI_CENTER = [28.6139, 77.2090];

function LocationPicker({ onPick }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6)) });
  return null;
}

const inputBase = {
  width: '100%',
  padding: '10px 13px',
  border: '1.5px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.9rem',
  color: 'var(--text)',
  backgroundColor: '#fff',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.18s, box-shadow 0.18s',
};

const labelBase = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--muted)',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

function Field({ label, error, children }) {
  return (
    <div>
      <label style={labelBase}>{label}</label>
      {children}
      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '0.76rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertTriangle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

export default function ReportForm({ onSuccess }) {
  const [form, setForm]           = useState({ issueType: '', description: '', lat: '', lng: '', photo: null });
  const [errors, setErrors]       = useState({});
  const [status, setStatus]       = useState('idle');
  const [errorMsg, setErrorMsg]   = useState('');
  const [showMap, setShowMap]     = useState(false);
  const [marker, setMarker]       = useState(null);
  const [photoName, setPhotoName] = useState('');
  const fileRef = useRef();

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.issueType)              e.issueType   = 'Please select an issue type.';
    if (!form.description.trim())     e.description = 'Description is required.';
    if (!form.lat || isNaN(+form.lat)) e.lat        = 'Enter a valid latitude.';
    if (!form.lng || isNaN(+form.lng)) e.lng        = 'Enter a valid longitude.';
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
    setErrors({}); setStatus('idle'); setErrorMsg('');
    setMarker(null); setPhotoName('');
    if (fileRef.current) fileRef.current.value = '';
  }

  /* ─────────────── Success Screen ─────────────── */
  if (status === 'success') {
    return (
      <div className="fade-up" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #52b788, #2d6a4f)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem',
          boxShadow: '0 6px 20px rgba(82,183,136,0.4)',
        }}>
          <CheckCircle size={34} color="#fff" strokeWidth={2.5} />
        </div>
        <h2 style={{ fontWeight: 800, fontSize: '1.35rem', color: 'var(--forest-dk)', marginBottom: 8 }}>
          Report Submitted!
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: 360, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          Your report has been saved locally. Once AWS integration is complete, it will be forwarded to the response team automatically.
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 8,
          backgroundColor: '#fef3e6', border: '1px solid #f4a26140',
          fontSize: '0.78rem', color: '#d4760a', fontWeight: 600, marginBottom: '1.5rem',
        }}>
          ⚡ AWS not yet connected — saved locally
        </div>
        <br />
        <button
          id="report-submit-another"
          onClick={handleReset}
          style={{
            padding: '11px 28px',
            background: 'linear-gradient(135deg, #2d6a4f, #40916c)',
            color: '#fff', border: 'none', borderRadius: 8,
            cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
            boxShadow: '0 3px 12px rgba(45,106,79,0.3)',
          }}
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  const selectedIssue = ISSUE_TYPES.find(t => t.value === form.issueType);

  /* ─────────────── Form ─────────────── */
  return (
    <form id="report-form" onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Issue type — visual selector */}
      <div>
        <span style={labelBase}>Issue Type *</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {ISSUE_TYPES.map(({ value, label, icon: Icon, color }) => {
            const selected = form.issueType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => set('issueType', value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '10px 13px',
                  borderRadius: 10,
                  border: selected ? `2px solid ${color}` : '1.5px solid var(--border)',
                  backgroundColor: selected ? `${color}10` : '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.84rem',
                  fontWeight: selected ? 700 : 500,
                  color: selected ? color : 'var(--text-md)',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={15} color={selected ? color : 'var(--muted)'} />
                {label}
              </button>
            );
          })}
        </div>
        {errors.issueType && (
          <p style={{ color: 'var(--danger)', fontSize: '0.76rem', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <AlertTriangle size={11} /> {errors.issueType}
          </p>
        )}
      </div>

      {/* Description */}
      <Field label="Description *" error={errors.description}>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe the problem clearly — location details, severity, how long it's been happening…"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          onFocus={e => { e.target.style.borderColor = 'var(--forest-lt)'; e.target.style.boxShadow = '0 0 0 3px rgba(82,183,136,0.15)'; }}
          onBlur={e  => { e.target.style.borderColor = 'var(--border)';    e.target.style.boxShadow = 'none'; }}
          style={{ ...inputBase, resize: 'vertical', lineHeight: 1.65 }}
        />
      </Field>

      {/* Coordinates */}
      <div>
        <span style={labelBase}>Location *</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <Field label="Latitude" error={errors.lat}>
            <input
              id="latitude" type="number" step="any" placeholder="e.g. 28.6139"
              value={form.lat}
              onChange={e => set('lat', e.target.value)}
              onFocus={e => { e.target.style.borderColor = 'var(--forest-lt)'; e.target.style.boxShadow = '0 0 0 3px rgba(82,183,136,0.15)'; }}
              onBlur={e  => { e.target.style.borderColor = 'var(--border)';    e.target.style.boxShadow = 'none'; }}
              style={inputBase}
            />
          </Field>
          <Field label="Longitude" error={errors.lng}>
            <input
              id="longitude" type="number" step="any" placeholder="e.g. 77.2090"
              value={form.lng}
              onChange={e => set('lng', e.target.value)}
              onFocus={e => { e.target.style.borderColor = 'var(--forest-lt)'; e.target.style.boxShadow = '0 0 0 3px rgba(82,183,136,0.15)'; }}
              onBlur={e  => { e.target.style.borderColor = 'var(--border)';    e.target.style.boxShadow = 'none'; }}
              style={inputBase}
            />
          </Field>
        </div>

        {/* Map picker toggle */}
        <button
          type="button"
          id="toggle-map-picker"
          onClick={() => setShowMap(v => !v)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '8px 15px',
            border: '1.5px solid var(--forest)',
            borderRadius: 8,
            backgroundColor: showMap ? 'var(--forest)' : 'transparent',
            color: showMap ? '#fff' : 'var(--forest)',
            cursor: 'pointer',
            fontSize: '0.84rem',
            fontWeight: 600,
            fontFamily: 'inherit',
            transition: 'all 0.18s',
          }}
        >
          <MapPin size={14} />
          {showMap ? 'Hide Map' : 'Pick on Map'}
        </button>

        {form.lat && form.lng && !isNaN(+form.lat) && !isNaN(+form.lng) && (
          <span style={{
            marginLeft: 10, fontSize: '0.78rem', color: 'var(--forest)',
            fontWeight: 600, backgroundColor: '#e8f7ef',
            padding: '4px 10px', borderRadius: 6,
          }}>
            📍 {(+form.lat).toFixed(4)}, {(+form.lng).toFixed(4)}
          </span>
        )}

        {showMap && (
          <div style={{ marginTop: 12, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1.5px solid var(--forest-lt)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{
              padding: '7px 12px',
              background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
              color: '#fff',
              fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <MapPin size={12} /> Click anywhere on the map to set your coordinates
            </div>
            <MapContainer
              id="location-picker-map"
              center={marker ? [marker[0], marker[1]] : DELHI_CENTER}
              zoom={11}
              style={{ height: 300 }}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
              <LocationPicker onPick={(lat, lng) => { setMarker([lat, lng]); set('lat', lat); set('lng', lng); }} />
              {marker && <Marker position={marker} />}
            </MapContainer>
          </div>
        )}
      </div>

      {/* Photo upload */}
      <div>
        <span style={labelBase}>Photo (optional)</span>
        <label htmlFor="photo-upload" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px',
          border: '1.5px dashed var(--border)',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: '#fafcfb',
          cursor: 'pointer',
          transition: 'border-color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--forest-lt)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <Camera size={18} color="var(--muted)" />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-md)' }}>
              {photoName || 'Click to attach a photo'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted-lt)' }}>JPG, PNG, WebP · Max 5 MB</div>
          </div>
        </label>
        <input
          id="photo-upload" type="file" accept="image/*" ref={fileRef}
          style={{ display: 'none' }}
          onChange={e => {
            const f = e.target.files[0] || null;
            set('photo', f);
            setPhotoName(f ? f.name : '');
          }}
        />
      </div>

      {/* Global error */}
      {status === 'error' && (
        <div style={{
          padding: '11px 14px',
          backgroundColor: '#fde8e8',
          border: '1px solid #c1121f33',
          borderRadius: 8,
          color: 'var(--danger)',
          fontSize: '0.85rem',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertTriangle size={16} /> {errorMsg}
        </div>
      )}

      {/* Submit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <button
          id="submit-report-btn"
          type="submit"
          disabled={status === 'submitting'}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px',
            background: status === 'submitting'
              ? 'var(--muted-lt)'
              : 'linear-gradient(135deg, #2d6a4f, #40916c)',
            color: '#fff',
            border: 'none', borderRadius: 10,
            cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            fontWeight: 700, fontSize: '0.95rem',
            fontFamily: 'inherit',
            boxShadow: status === 'submitting' ? 'none' : '0 4px 14px rgba(45,106,79,0.3)',
            letterSpacing: '0.01em',
            transition: 'opacity 0.18s',
          }}
        >
          <Send size={16} />
          {status === 'submitting' ? 'Submitting…' : 'Submit Report'}
        </button>

        <p style={{ fontSize: '0.74rem', color: 'var(--muted-lt)', maxWidth: 280, lineHeight: 1.5 }}>
          ⚡ Reports are saved locally until the AWS backend is connected.
        </p>
      </div>
    </form>
  );
}
