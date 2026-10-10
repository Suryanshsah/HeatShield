import { useState } from 'react';
import HourlyForecastStrip from '../components/HourlyForecastStrip';
import PlacesMapList from '../components/PlacesMapList';
import RadiusSelector from '../components/RadiusSelector';
import WaterStatusBadge from '../components/WaterStatusBadge';
import { AlertTriangle, CheckCircle2, ChevronRight, Compass, Droplets, Heart, Info, MapPin, RefreshCw, Sun, Thermometer, Trees, Wind, X } from 'lucide-react';

export default function OverviewPage({
  weather,
  weatherLoading,
  weatherError,
  refetchWeather,
  selectedLocation,
  waterPoints = [],
  waterLoading,
  radius,
  setRadius,
  reports = [],
  onConfirmWaterStatus,
  onNavigateTab,
  t,
}) {
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const availableWaterCount = waterPoints.filter(w => w.status === 'Available').length;
  const lowFlowCount = waterPoints.filter(w => w.status === 'Low flow').length;
  const notWorkingCount = waterPoints.filter(w => w.status === 'Not working').length;

  const nearestThree = waterPoints.slice(0, 3);
  const recentReports = reports.slice(0, 3);

  const isLive = weather?.isLive;
  const risk = weather?.risk || {
    level: 'High',
    badgeLabel: 'High Heat Risk',
    color: '#EE964B',
    advisoryBold: "It's a hot afternoon. Take it a little easier.",
    advisoryText: 'Limit time in direct sun, drink water regularly, and take breaks somewhere cool.',
  };

  const isHighOrExtreme = risk.level === 'High' || risk.level === 'Extreme';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">

      {/* ── High / Extreme Risk Dismissible Top Alert Banner ── */}
      {isHighOrExtreme && !bannerDismissed && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: risk.bgColor || 'var(--heat-mod-bg)',
          border: `1.5px solid ${risk.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          boxShadow: 'var(--shadow-sm)',
        }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={20} color={risk.color} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ⚠️ High heat risk in {selectedLocation?.name || 'your area'} right now. See water and cool places nearby.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => onNavigateTab('find-relief')}
              style={{
                padding: '6px 14px',
                borderRadius: 99,
                backgroundColor: risk.color,
                color: '#07201F',
                fontWeight: 800,
                fontSize: '0.78rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              See water nearby →
            </button>
            <button
              onClick={() => setBannerDismissed(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ──────────────── 1. HERO HEADER ──────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6FD3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {t.eyebrowHeader}
          </span>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', margin: '4px 0' }}>
            {t.headlineMain}
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            {t.subtitleMain}
          </p>
        </div>

        {/* Live Weather Badge & Data Source Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isLive ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sub)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
              <span>Live (Open-Meteo)</span>
            </div>
          ) : (
            <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: 4, backgroundColor: 'var(--bg-surface-subtle)', color: 'var(--text-sub)', border: '1px solid var(--border-color)' }}>
              {t.demoDataBadge}
            </span>
          )}
        </div>
      </div>

      {/* ──────────────── 2. TWO-COLUMN MAIN GRID ──────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 20,
      }} className="overview-main-grid">

        {/* ──────── LEFT CARD: Heat in your area ──────── */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Thermometer size={20} color="#6FD3B8" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {t.heatInAreaTitle}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Dynamic Risk Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 12px',
                borderRadius: 99,
                backgroundColor: risk.bgColor || 'rgba(238, 150, 75, 0.15)',
                color: risk.color || '#EE964B',
                border: `1px solid ${risk.color || '#EE964B'}`,
                fontSize: '0.78rem',
                fontWeight: 800,
              }}>
                <AlertTriangle size={13} />
                <span>{risk.badgeLabel}</span>
              </div>

              {/* Refresh Live Button */}
              <button
                onClick={refetchWeather}
                title="Refresh weather"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <RefreshCw size={14} className={weatherLoading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Fallback Notice if live fetch failed */}
          {weatherError && (
            <div style={{ fontSize: '0.76rem', color: '#F95738', backgroundColor: 'rgba(249, 87, 56, 0.1)', padding: '6px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Couldn't reach live weather, showing example data.</span>
              <button onClick={refetchWeather} style={{ background: 'none', border: 'none', color: '#F95738', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>
                Retry
              </button>
            </div>
          )}

          {/* Skeleton or Main Weather Stat */}
          {weatherLoading ? (
            <div style={{ padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Updating live heat conditions from Open-Meteo...
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Sun size={48} color="#F4D35E" strokeWidth={1.5} />
                <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                  {weather?.tempActual || 36}°C
                </span>
              </div>

              <div style={{ width: 1, height: 44, backgroundColor: 'var(--border-subtle)' }} />

              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {t.feelsLike}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {weather?.tempFeelsLike || 42}°C
                </div>
              </div>
            </div>
          )}

          {/* Subline */}
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {weather?.condition || 'Sunny'} · Humidity {weather?.humidity || '62%'} · Source: Open-Meteo
          </div>

          {/* Dynamic Advisory Callout */}
          <div style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: risk.bgColor || 'var(--heat-mod-bg)',
            border: `1px solid ${risk.color || '#EE964B'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}>
            <AlertTriangle size={20} color={risk.color || '#EE964B'} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: risk.color || '#c2410c', marginBottom: 2 }}>
                {risk.advisoryBold}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', lineHeight: 1.45 }}>
                {risk.advisoryText}
              </div>
            </div>
          </div>

          {/* Hourly Forecast Strip */}
          <HourlyForecastStrip hourly={weather?.hourly || []} />
        </div>

        {/* ──────── RIGHT STACK ──────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Upgraded Card 1: Water Nearby */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-sub)' }}>
                <Droplets size={16} color="#6FD3B8" />
                <span>{t.waterNearbyTitle}</span>
              </div>
              <RadiusSelector radius={radius} setRadius={setRadius} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {availableWaterCount} points available within {radius >= 1000 ? `${radius / 1000} km` : `${radius} m`}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Nearest: {nearestThree[0]?.distanceLabel || '250 m'} · {nearestThree[0]?.walkTime || '3 min walk'}
              </p>
            </div>

            {/* Status Summary Chips */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99, backgroundColor: 'var(--brand-aqua-light)', color: 'var(--brand-aqua-dark)' }}>
                Available ({availableWaterCount})
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99, backgroundColor: 'rgba(238, 150, 75, 0.15)', color: '#EE964B' }}>
                Low flow ({lowFlowCount})
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99, backgroundColor: 'rgba(249, 87, 56, 0.15)', color: '#F95738' }}>
                Not working ({notWorkingCount})
              </span>
            </div>

            {/* Mini List of 3 Nearest Points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
              {nearestThree.map(wp => (
                <div key={wp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', padding: '4px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: wp.status === 'Available' ? '#6FD3B8' : '#EE964B' }} />
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{wp.name}</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>{wp.distanceLabel} ({wp.walkTime})</span>
                </div>
              ))}
            </div>

            {/* Full-width Mint Button */}
            <button
              onClick={() => onNavigateTab('find-relief')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#6FD3B8',
                color: '#07201F',
                fontWeight: 800,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(111, 211, 184, 0.25)',
                marginTop: 4,
              }}
            >
              {t.btnFindWater}
            </button>
          </div>

          {/* Card 2: Habits Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{
              height: 120,
              background: 'linear-gradient(to bottom, rgba(7,32,31,0.2), rgba(7,32,31,0.8)), url("https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} />

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {t.shadyParkHeadline}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} color="#6FD3B8" /> {t.habit1}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} color="#6FD3B8" /> {t.habit2}
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('stay-safe')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6FD3B8',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: 0,
                  marginTop: 4,
                }}
              >
                {t.linkMoreWays}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ──────────────── 3. FIND RELIEF NEARBY MAP SECTION ──────────────── */}
      <section style={{ marginTop: 10 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {t.findReliefTitle}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {t.findReliefSubtitle}
          </p>
        </div>

        <PlacesMapList
          places={[]}
          waterPoints={waterPoints}
          reports={reports}
          userLocation={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
          radius={radius}
          setRadius={setRadius}
          heatRiskLevel={risk.level}
          onConfirmWaterStatus={onConfirmWaterStatus}
          t={t}
        />
      </section>

      {/* ──────────────── 4. REPORT CALLOUT BOX ──────────────── */}
      <section style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {t.reportCalloutTitle}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {t.reportCalloutSub}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('report')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#6FD3B8',
              color: '#07201F',
              fontWeight: 800,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t.btnReportProblem}
          </button>
        </div>
      </section>

      <style>{`
        @media (min-width: 992px) {
          .overview-main-grid {
            grid-template-columns: 1.6fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
