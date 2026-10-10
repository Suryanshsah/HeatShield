import { AlertTriangle, Droplets, MapPin, RefreshCw, ThermometerSun, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchReports, fetchWaterPoints } from '../services/api';
import { fetchLiveDelhiWeather } from '../services/weatherApi';
import HeatRiskMap from './HeatRiskMap';
import RecentReports from './RecentReports';
import RiskLegend from './RiskLegend';
import StatCard from './StatCard';
import { useLanguage } from '../context/LanguageContext';

function SkeletonCard() {
  return (
    <div style={{
      flex: '1 1 200px', minWidth: 0,
      backgroundColor: 'var(--card)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.4rem 1.5rem',
      border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }} />
      <div className="skeleton" style={{ width: '60%', height: 14, borderRadius: 4 }} />
      <div className="skeleton" style={{ width: '40%', height: 32, borderRadius: 6 }} />
    </div>
  );
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [waterPoints, setWaterPoints] = useState([]);
  const [reports, setReports]       = useState([]);
  const [weather, setWeather]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [wps, rpts, wx] = await Promise.all([
        fetchWaterPoints(),
        fetchReports(),
        fetchLiveDelhiWeather(),
      ]);
      setWaterPoints(wps);
      setReports(rpts);
      setWeather(wx);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCount   = reports.filter((r) => r.status === 'open').length;
  const brokenCount = waterPoints.filter((w) => w.status === 'broken').length;

  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: '1.75rem 1.25rem' }}>

      {/* Hero Header */}
      <div className="fade-up" style={{
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #40916c 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem 2rem',
        marginBottom: '1.5rem',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: '0 6px 24px rgba(27,67,50,0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
            {t('dashboard')}
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', maxWidth: 520, lineHeight: 1.5 }}>
            Live Delhi heat-wave risk monitoring &amp; community water access portal.
          </p>
        </div>

        {/* Live Weather Status Badge */}
        {weather && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 18px',
            borderRadius: 99,
            backgroundColor: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            backdropFilter: 'blur(4px)',
          }}>
            <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: weather.accent }} />
            <div style={{ fontSize: '0.82rem' }}>
              <strong style={{ color: '#fff' }}>Delhi Temp: {weather.temp}</strong>
              <span style={{ color: 'rgba(255,255,255,0.8)', marginLeft: 6 }}>Feels: {weather.feelsLike}</span>
            </div>
            <button
              onClick={loadData}
              title="Refresh weather & reports"
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <RefreshCw size={14} className={loading ? 'pulse-dot' : ''} />
            </button>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {fetchError && (
        <div style={{
          padding: '10px 16px',
          backgroundColor: '#fde8e8',
          border: '1px solid #c1121f33',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--danger)',
          fontSize: '0.85rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <AlertTriangle size={16} />
          Could not load data: {fetchError}
        </div>
      )}

      {/* Stat cards */}
      <section aria-label="Summary statistics" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {loading || !weather ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          <>
            <StatCard
              id="stat-heat-risk"
              icon={ThermometerSun}
              label={t('heatRiskLevel')}
              value={weather.level}
              subtitle={`${weather.feelsLike} feels-like · Humidity ${weather.humidity}`}
              accentColor={weather.accent}
            />
            <StatCard
              id="stat-water-points"
              icon={Droplets}
              label={t('waterPoints')}
              value={waterPoints.length}
              subtitle={`${brokenCount} reported broken`}
              accentColor="var(--forest)"
            />
            <StatCard
              id="stat-open-incidents"
              icon={AlertTriangle}
              label={t('openIncidents')}
              value={openCount}
              subtitle={`${reports.length} total reports`}
              accentColor="var(--accent)"
            />
          </>
        )}
      </section>

      {/* Live Heat Advisory Banner */}
      {weather && (
        <div className="fade-up" style={{
          backgroundColor: weather.bg,
          border: `1px solid ${weather.accent}40`,
          borderLeft: `5px solid ${weather.accent}`,
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            backgroundColor: `${weather.accent}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <ThermometerSun size={20} color={weather.accent} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: weather.accent, marginBottom: 3 }}>
              {t('heatAdvisory')} — {weather.level} Risk ({weather.temp})
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-md)', lineHeight: 1.5 }}>{weather.advisory}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 4 }}>
              Live Open-Meteo Weather Stream · Delhi (28.61°N, 77.20°E) · Updated: {weather.timestamp}
            </div>
          </div>
        </div>
      )}

      {/* Map + Sidebar */}
      <section aria-label="Heat risk map" style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 14, marginBottom: '1.5rem' }}>
        <div style={{ minWidth: 0 }}>
          {loading
            ? <div className="skeleton" style={{ height: 450, borderRadius: 'var(--radius-lg)' }} />
            : <HeatRiskMap waterPoints={waterPoints} reports={reports} onRefresh={loadData} />
          }
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <RiskLegend />

          {/* Water Status Breakdown */}
          <div style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{
              padding: '0.65rem 1rem',
              background: 'linear-gradient(to right, var(--border-lt), var(--card))',
              borderBottom: '1px solid var(--border)',
            }}>
              <h3 style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                💧 {t('waterStatus')}
              </h3>
            </div>
            <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { status: 'operational', label: t('operational'), color: '#52b788', bg: '#e8f7ef' },
                { status: 'low-supply',  label: t('lowSupply'),   color: '#f4a261', bg: '#fef3e6' },
                { status: 'broken',      label: t('broken'),      color: '#c1121f', bg: '#fde8e8' },
              ].map(({ status, label, color, bg }) => {
                const count = waterPoints.filter((w) => w.status === status).length;
                const pct   = waterPoints.length ? Math.round(count / waterPoints.length * 100) : 0;
                return (
                  <div key={status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text-md)', fontWeight: 500 }}>{label}</span>
                      <span style={{ fontWeight: 700, color }}>{loading ? '—' : count}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 99, backgroundColor: bg, overflow: 'hidden' }}>
                      <div style={{
                        width: loading ? '0%' : `${pct}%`,
                        height: '100%',
                        backgroundColor: color,
                        borderRadius: 99,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick CTA */}
          <Link
            to="/report"
            id="cta-report-problem"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px 20px',
              background: 'linear-gradient(135deg, #e76f51, #d4602a)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: '0 4px 14px rgba(231,111,81,0.35)',
              textAlign: 'center',
            }}
          >
            <MapPin size={17} />
            {t('reportProblem')}
          </Link>
        </div>
      </section>

      {/* Recent Reports Section */}
      <section aria-label="Recent reports" style={{ marginBottom: '2.5rem' }}>
        <RecentReports reports={reports} onReportUpdated={loadData} />
      </section>

      <style>{`
        @media (max-width: 860px) {
          section[aria-label="Heat risk map"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          section[aria-label="Summary statistics"] > div { flex: 1 1 100% !important; }
        }
      `}</style>
    </main>
  );
}
