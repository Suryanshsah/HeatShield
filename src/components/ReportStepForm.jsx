import { useRef, useState } from 'react';
import { CircleMarker, MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { submitReport } from '../services/api';
import { AlertOctagon, AlertTriangle, Camera, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock, Compass, Droplets, Edit3, HelpCircle, MapPin, Send, ShieldAlert, Trees, Wind, Wrench, X } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DELHI_DEFAULT = [28.6139, 77.2090];

function DraggableMarker({ position, setPosition }) {
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const latlng = marker.getLatLng();
        setPosition([latlng.lat.toFixed(6), latlng.lng.toFixed(6)]);
      }
    },
  };

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6)]);
    },
  });

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
}

export default function ReportStepForm({ onReportSubmitted, onBackToMap, t }) {
  const [step, setStep] = useState(1); // 1 | 2 | 3 | 4 (success)

  const [form, setForm] = useState({
    issueType: '',
    issueLabel: '',
    category: 'water',
    lat: '28.6139',
    lng: '77.2090',
    locationName: '',
    urgency: 'serious',
    description: '',
    photo: null,
    photoPreview: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdReport, setCreatedReport] = useState(null);

  const fileRef = useRef();

  const issueOptions = [
    { id: 'no-water',       label: t.issueNoWater,       sub: t.issueNoWaterSub,       icon: Droplets,     category: 'water' },
    { id: 'broken-tap',     label: t.issueBrokenTap,     sub: t.issueBrokenTapSub,     icon: Wrench,       category: 'water' },
    { id: 'leak',           label: t.issueLeak,          sub: t.issueLeakSub,          icon: AlertTriangle,category: 'water' },
    { id: 'dirty-water',    label: t.issueDirtyWater,    sub: t.issueDirtyWaterSub,    icon: ShieldAlert,  category: 'water' },
    { id: 'cooling-closed', label: t.issueCoolingClosed, sub: t.issueCoolingClosedSub, icon: Wind,         category: 'heat' },
    { id: 'need-shade',     label: t.issueNeedShade,     sub: t.issueNeedShadeSub,     icon: Trees,        category: 'safety' },
    { id: 'other',          label: t.issueOther,         sub: t.issueOtherSub,         icon: HelpCircle,   category: 'safety' },
  ];

  const urgencyOptions = [
    { id: 'minor',   label: t.severityMinor,   desc: t.severityMinorDesc,   color: '#6FD3B8', icon: Compass },
    { id: 'serious', label: t.severitySerious, desc: t.severitySeriousDesc, color: '#EE964B', icon: AlertTriangle },
    { id: 'urgent',  label: t.severityUrgent,  desc: t.severityUrgentDesc,  color: '#F95738', icon: AlertOctagon },
  ];

  function updateField(field, val) {
    setForm(prev => ({ ...prev, [field]: val }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function handleSelectIssue(option) {
    setForm(prev => ({
      ...prev,
      issueType: option.id,
      issueLabel: option.label,
      category: option.category,
    }));
    setErrors(prev => ({ ...prev, issueType: undefined }));
  }

  function validateStep1() {
    if (!form.issueType) {
      setErrors({ issueType: 'Please select an issue type to proceed.' });
      return false;
    }
    return true;
  }

  function validateStep2() {
    const errs = {};
    if (!form.locationName.trim()) {
      errs.locationName = 'Please enter a landmark or street location.';
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return false;
    }
    return true;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  }

  function handleUseMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateField('lat', pos.coords.latitude.toFixed(6));
          updateField('lng', pos.coords.longitude.toFixed(6));
        },
        () => {
          updateField('lat', '28.6139');
          updateField('lng', '77.2090');
        }
      );
    }
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      updateField('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('photoPreview', reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await submitReport({
        issueType: form.issueType,
        issueLabel: form.issueLabel,
        category: form.category,
        locationName: form.locationName,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        urgency: form.urgency,
        description: form.description,
        photo: form.photoPreview,
      });

      setCreatedReport(result);
      setIsSubmitting(false);
      setStep(4); // Success screen
      if (onReportSubmitted) onReportSubmitted(result);
    } catch (err) {
      setIsSubmitting(false);
      setSubmitError(err.message || 'Submission failed. Please try again.');
    }
  }

  function handleReset() {
    setForm({
      issueType: '',
      issueLabel: '',
      category: 'water',
      lat: '28.6139',
      lng: '77.2090',
      locationName: '',
      urgency: 'serious',
      description: '',
      photo: null,
      photoPreview: null,
    });
    setErrors({});
    setStep(1);
  }

  /* ────────────────── SUCCESS SCREEN (STEP 4) ────────────────── */
  if (step === 4 && createdReport) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 1.5rem',
        maxWidth: 640,
        margin: '0 auto',
        textAlign: 'center',
        boxShadow: 'var(--shadow-md)',
      }} className="animate-fade-in">
        {/* Animated Checkmark Circle */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: 'var(--brand-aqua-light)',
          color: '#6FD3B8',
          border: '2px solid #6FD3B8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <CheckCircle2 size={42} />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>
          {t.successTitle}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-sub)', marginBottom: 16 }}>
          {t.successSubtitle}
        </p>

        {/* Reference ID Chip */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          borderRadius: 99,
          backgroundColor: 'var(--bg-surface-subtle)',
          border: '1px solid var(--border-color)',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: 24,
        }}>
          <span>{t.reportIdLabel}:</span>
          <span style={{ color: '#6FD3B8', fontFamily: 'monospace', fontSize: '0.95rem' }}>
            {createdReport.id}
          </span>
        </div>

        {/* What Happens Next Timeline */}
        <div style={{
          backgroundColor: 'var(--bg-surface-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: 24,
          textAlign: 'left',
        }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            What Happens Next
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            {[
              { label: t.timelineReceived, status: 'done' },
              { label: t.timelineReviewed, status: 'current' },
              { label: t.timelinePassed,   status: 'pending' },
            ].map((stepItem, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1, zIndex: 1 }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: stepItem.status === 'done' ? '#6FD3B8' : stepItem.status === 'current' ? 'var(--brand-aqua-light)' : 'var(--bg-surface)',
                  border: stepItem.status === 'done' ? 'none' : '2px solid #6FD3B8',
                  color: stepItem.status === 'done' ? '#07201F' : '#6FD3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                }}>
                  {stepItem.status === 'done' ? <Check size={14} /> : i + 1}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: stepItem.status === 'current' ? 800 : 600, color: 'var(--text-main)' }}>
                  {stepItem.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Offline / AWS Sync Disclaimer */}
        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: 24 }}>
          ⚡ {t.offlineMessage}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleReset}
            style={{
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            {t.btnReportAnother}
          </button>
          <button
            onClick={onBackToMap}
            style={{
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#6FD3B8',
              color: '#07201F',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            {t.btnBackToMap}
          </button>
        </div>
      </div>
    );
  }

  /* ────────────────── WIZARD FORM (STEPS 1 - 3) ────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Progress Indicator Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16 }}>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6FD3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t.reportPageEyebrow}
          </span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {t.reportPageTitle}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {t.reportPageSubtitle}
          </p>
        </div>

        {/* Step pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3].map(num => (
            <div
              key={num}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: step === num ? '#6FD3B8' : step > num ? 'var(--brand-aqua-light)' : 'var(--bg-surface-subtle)',
                color: step === num ? '#07201F' : step > num ? 'var(--brand-aqua-dark)' : 'var(--text-muted)',
                fontWeight: 800,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: step === num ? 'none' : '1px solid var(--border-color)',
              }}
            >
              {step > num ? <Check size={16} /> : num}
            </div>
          ))}
        </div>
      </div>

      {/* ──────────────── STEP 1: What's the issue? ──────────────── */}
      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {t.step1Title}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {issueOptions.map((opt) => {
              const selected = form.issueType === opt.id;
              const IconComp = opt.icon;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectIssue(opt)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-xl)',
                    border: selected ? '2px solid #6FD3B8' : '1px solid var(--border-color)',
                    backgroundColor: selected ? 'var(--brand-aqua-light)' : 'var(--bg-surface)',
                    color: selected ? 'var(--brand-aqua-dark)' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    minHeight: 80,
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: selected ? '#6FD3B8' : 'var(--bg-surface-subtle)',
                    color: selected ? '#07201F' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <IconComp size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2 }}>{opt.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {errors.issueType && (
            <div style={{ color: '#F95738', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertTriangle size={14} /> {errors.issueType}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button
              onClick={handleNext}
              style={{
                minHeight: 46,
                padding: '12px 28px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#6FD3B8',
                color: '#07201F',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{t.btnNext}</span>
            </button>
          </div>
        </div>
      )}

      {/* ──────────────── STEP 2: Where and how urgent? ──────────────── */}
      {step === 2 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {t.step2Title}
          </h3>

          {/* Draggable Mini Map */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sub)' }}>
                Drag pin or tap map to set location
              </span>
              <button
                type="button"
                onClick={handleUseMyLocation}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6FD3B8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <MapPin size={13} /> {t.useMyLocation}
              </button>
            </div>

            <div style={{ height: 220, borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <MapContainer
                center={[parseFloat(form.lat), parseFloat(form.lng)]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <DraggableMarker
                  position={[parseFloat(form.lat), parseFloat(form.lng)]}
                  setPosition={([lat, lng]) => {
                    updateField('lat', lat);
                    updateField('lng', lng);
                  }}
                />
              </MapContainer>
            </div>
          </div>

          {/* Landmark Text Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sub)', marginBottom: 6 }}>
              {t.landmarkLabel} *
            </label>
            <input
              type="text"
              placeholder={t.landmarkPlaceholder}
              value={form.locationName}
              onChange={(e) => updateField('locationName', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: errors.locationName ? '2px solid #F95738' : '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            {errors.locationName && (
              <div style={{ color: '#F95738', fontSize: '0.78rem', fontWeight: 700, marginTop: 4 }}>
                {errors.locationName}
              </div>
            )}
          </div>

          {/* Urgency Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sub)', marginBottom: 8 }}>
              Urgency Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {urgencyOptions.map((urg) => {
                const selected = form.urgency === urg.id;
                const UrgIcon = urg.icon;
                return (
                  <button
                    key={urg.id}
                    type="button"
                    onClick={() => updateField('urgency', urg.id)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 'var(--radius-md)',
                      border: selected ? `2px solid ${urg.color}` : '1px solid var(--border-color)',
                      backgroundColor: selected ? `${urg.color}18` : 'var(--bg-surface)',
                      color: selected ? urg.color : 'var(--text-sub)',
                      fontWeight: selected ? 800 : 600,
                      fontSize: '0.82rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <UrgIcon size={18} />
                    <span>{urg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sub)' }}>
                {t.descLabel}
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {form.description.length}/200
              </span>
            </div>
            <textarea
              maxLength={200}
              rows={3}
              placeholder={t.descPlaceholder}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sub)', marginBottom: 6 }}>
              {t.photoLabel}
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-color)',
                backgroundColor: 'var(--bg-surface-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
              }}
            >
              <Camera size={18} color="#6FD3B8" />
              <span>{form.photo ? form.photo.name : t.photoHint}</span>
            </div>
            {form.photoPreview && (
              <div style={{ marginTop: 8, position: 'relative', display: 'inline-block' }}>
                <img src={form.photoPreview} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                <button
                  type="button"
                  onClick={() => { updateField('photo', null); updateField('photoPreview', null); }}
                  style={{ position: 'absolute', top: -6, right: -6, background: '#F95738', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer' }}
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <button
              onClick={() => setStep(1)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <ChevronLeft size={16} /> {t.btnBack}
            </button>
            <button
              onClick={handleNext}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#6FD3B8',
                color: '#07201F',
                border: 'none',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {t.btnNext} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ──────────────── STEP 3: Review and send ──────────────── */}
      {step === 3 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {t.step3Title}
          </h3>

          <div style={{
            backgroundColor: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            border: '1px solid var(--border-color)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Issue Type
                </span>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  {form.issueLabel}
                </div>
              </div>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#6FD3B8', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Edit3 size={13} /> Edit
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Location &amp; Urgency
                </span>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  📍 {form.locationName} ({form.lat}, {form.lng})
                </div>
                <div style={{ fontSize: '0.78rem', color: form.urgency === 'urgent' ? '#F95738' : '#EE964B', fontWeight: 700 }}>
                  Urgency: {form.urgency.toUpperCase()}
                </div>
              </div>
              <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#6FD3B8', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Edit3 size={13} /> Edit
              </button>
            </div>

            {form.description && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Description
                </span>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-sub)' }}>
                  {form.description}
                </p>
              </div>
            )}
          </div>

          {submitError && (
            <div style={{ color: '#F95738', fontSize: '0.85rem', fontWeight: 700 }}>
              ⚠️ {submitError}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <button
              onClick={() => setStep(2)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                padding: '12px 32px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#6FD3B8',
                color: '#07201F',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Send size={18} />
              {isSubmitting ? 'Sending Report...' : t.btnSubmit}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
