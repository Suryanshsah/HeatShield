import { useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { reverseGeocode, submitReport } from '../services/api';
import { AlertTriangle, Camera, CheckCircle, Crosshair, Droplets, MapPin, Navigation, Send, Wrench, X } from 'lucide-react';
import L from 'leaflet';
import { useLanguage } from '../context/LanguageContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
  const { t } = useLanguage();

  const ISSUE_TYPES = [
    { value: 'broken-tap',          label: t('brokenTap'),          icon: Wrench,        color: '#c1121f' },
    { value: 'water-unavailable',   label: t('waterUnavailable'),   icon: Droplets,      color: '#e76f51' },
    { value: 'leaking-pipe',        label: t('leakingPipe'),        icon: AlertTriangle, color: '#d4760a' },
    { value: 'cooling-unavailable', label: t('coolingUnavailable'), icon: Navigation,    color: '#7b5ea7' },
  ];

  const [form, setForm]           = useState({ issueType: '', description: '', address: '', lat: '', lng: '', photo: null });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors]       = useState({});
  const [status, setStatus]       = useState('idle');
  const [errorMsg, setErrorMsg]   = useState('');
  const [showMap, setShowMap]     = useState(false);
  const [marker, setMarker]       = useState(null);
  const [locating, setLocating]   = useState(false);
  const fileRef = useRef();

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  }

  // Reverse geocode when coordinates change
  async function handleCoordsSet(latVal, lngVal) {
    set('lat', latVal);
    set('lng', lngVal);
    setMarker([parseFloat(latVal), parseFloat(lngVal)]);
    try {
      const addr = await reverseGeocode(latVal, lngVal);
      if (addr) set('address', addr);
    } catch (e) {
      console.warn('Geocoding error:', e);
    }
  }

  // Geolocation trigger
  function handleDetectGPS() {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        await handleCoordsSet(lat, lng);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setErrorMsg('Unable to retrieve location. Please select on the map or enter coordinates.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      set('photo', file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  }

  function handleClearPhoto() {
    set('photo', null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = '';
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
        address:     form.address,
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
    setForm({ issueType: '', description: '', address: '', lat: '', lng: '', photo: null });
    setErrors({}); setStatus('idle'); setErrorMsg('');
    setMarker(null); setPhotoPreview(null);
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
          Report Saved &amp; Broadcasted!
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          Your report has been persistently stored in the system. Response teams and citizens can view, upvote, and track its resolution status in real time.
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 8,
          backgroundColor: '#e8f7ef', border: '1px solid #52b78840',
          fontSize: '0.78rem', color: '#2d6a4f', fontWeight: 600, marginBottom: '1.5rem',
        }}>
          ✅ Saved &amp; Live on Dashboard Map
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

  return (
    <form id="report-form" onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Issue type selector */}
      <div>
        <span style={labelBase}>{t('issueType')} *</span>
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
      <Field label={`${t('description')} *`} error={errors.description}>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe the problem clearly — location details, severity, how long it's been happening..."
          value={form.description}
          onChange={e => set('description', e.target.value)}
          onFocus={e => { e.target.style.borderColor = 'var(--forest-lt)'; e.target.style.boxShadow = '0 0 0 3px rgba(82,183,136,0.15)'; }}
          onBlur={e  => { e.target.style.borderColor = 'var(--border)';    e.target.style.boxShadow = 'none'; }}
          style={{ ...inputBase, resize: 'vertical', lineHeight: 1.65 }}
        />
      </Field>

      {/* Landmark / Address */}
      <Field label={t('address')}>
        <input
          id="address"
          type="text"
          placeholder="e.g. Near Lajpat Nagar Bus Stop / Block C Saket"
          value={form.address}
          onChange={e => set('address', e.target.value)}
          style={inputBase}
        />
      </Field>

      {/* Location Selection with GPS + Geocoding */}
      <div>
        <span style={labelBase}>{t('location')} *</span>
        
        {/* Helper Action Buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={locating}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px',
              border: '1.5px solid #2d6a4f',
              borderRadius: 8,
              backgroundColor: '#e8f7ef',
              color: '#2d6a4f',
              cursor: locating ? 'wait' : 'pointer',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <Crosshair size={14} className={locating ? 'pulse-dot' : ''} />
            {locating ? 'Detecting Location...' : t('detectLocation')}
          </button>

          <button
            type="button"
            id="toggle-map-picker"
            onClick={() => setShowMap(v => !v)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px',
              border: '1.5px solid var(--forest)',
              borderRadius: 8,
              backgroundColor: showMap ? 'var(--forest)' : 'transparent',
              color: showMap ? '#fff' : 'var(--forest)',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <MapPin size={14} />
            {showMap ? 'Hide Map' : t('pickOnMap')}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <Field label={t('latitude')} error={errors.lat}>
            <input
              id="latitude" type="number" step="any" placeholder="e.g. 28.6139"
              value={form.lat}
              onChange={e => handleCoordsSet(e.target.value, form.lng)}
              style={inputBase}
            />
          </Field>
          <Field label={t('longitude')} error={errors.lng}>
            <input
              id="longitude" type="number" step="any" placeholder="e.g. 77.2090"
              value={form.lng}
              onChange={e => handleCoordsSet(form.lat, e.target.value)}
              style={inputBase}
            />
          </Field>
        </div>

        {showMap && (
          <div style={{ marginTop: 12, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1.5px solid var(--forest-lt)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{
              padding: '7px 12px',
              background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
              color: '#fff',
              fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <MapPin size={12} /> Click on map to pinpoint location with auto reverse-geocoding
            </div>
            <MapContainer
              id="location-picker-map"
              center={marker ? [marker[0], marker[1]] : DELHI_CENTER}
              zoom={11}
              style={{ height: 300 }}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
              <LocationPicker onPick={(lat, lng) => handleCoordsSet(lat, lng)} />
              {marker && <Marker position={marker} />}
            </MapContainer>
          </div>
        )}
      </div>

      {/* Photo upload with Live Thumbnail Preview */}
      <div>
        <span style={labelBase}>{t('photoOptional')}</span>
        {photoPreview ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={photoPreview}
              alt="Upload preview"
              style={{ width: 140, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
            />
            <button
              type="button"
              onClick={handleClearPhoto}
              style={{
                position: 'absolute', top: -8, right: -8,
                backgroundColor: '#c1121f', color: '#fff',
                border: 'none', borderRadius: '50%', width: 22, height: 22,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <label htmlFor="photo-upload" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px',
            border: '1.5px dashed var(--border)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#fafcfb',
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}>
            <Camera size={18} color="var(--muted)" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-md)' }}>
                {t('clickToAttach')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted-lt)' }}>JPG, PNG, WebP · Encoded for offline &amp; live persistence</div>
            </div>
          </label>
        )}
        <input
          id="photo-upload" type="file" accept="image/*" ref={fileRef}
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
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
            transition: 'opacity 0.18s',
          }}
        >
          <Send size={16} />
          {status === 'submitting' ? t('submitting') : t('submitReport')}
        </button>
      </div>
    </form>
  );
}
