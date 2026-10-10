import { AlertTriangle, Droplets, MapPin, ThermometerSun, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HEAT_RISK_SUMMARY } from '../data/sampleData';
import { fetchReports, fetchWaterPoints } from '../services/api';
import HeatRiskMap from './HeatRiskMap';
import RecentReports from './RecentReports';
import RiskLegend from './RiskLegend';
import StatCard from './StatCard';

const RISK_ACCENT = {
  Low:      '#52b788',
  Moderate: '#f4a261',
  High:     '#e76f51',
  Severe:   '#c1121f',
};

const RISK_BG = {
  Low:      '#e8f7ef',
  Moderate: '#fef3e6',
  High:     '#fdeee9',
  Severe:   '#fde8e8',
};

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

export default function Dashboard({ localReports = [] }) {
  const [waterPoints,    setWaterPoints]    = useState([]);
  const [fetchedReports, setFetchedReports] = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [fetchError,     setFetchError]     = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([fetchWaterPoints(), fetchReports()])
      .then(([wps, rpts]) => {
        if (!active) return;
        setWaterPoints(wps);
        setFetchedReports(rpts);
      })
      .catch((err) => { if (active) setFetchError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const fetchedIds = new Set(fetchedReports.map((r) => r.id));
  const newLocal   = localReports.filter((r) => !fetchedIds.has(r.id));
  const reports    = [...newLocal, ...fetchedReports];

  const openCount   = reports.filter((r) => r.status === 'open').length;
  const brokenCount = waterPoints.filter((w) => w.status === 'broken').length;
  const riskLevel   = HEAT_RISK_SUMMARY.level;
  const riskAccent  = RISK_ACCENT[riskLevel] || '#e76f51';
  const riskBg      = RISK_BG[riskLevel]     || '#fdeee9';

  const isMockMode = !import.meta.env.VITE_API_URL;

  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: '1.75rem 1.25rem' }}>

      {/* ── Hero header ── */}
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
        {/* Decorative rings */}
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: -10, top: -10, width: 130, height: 130, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
            Community Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', maxWidth: 480 }}>
            Delhi heat-risk overview and water-access status.{' '}
            <em style={{ color: 'rgba(255,255,255,0.5)' }}>Sample data — not verified or real-time.</em>
          </p>
        </div>

        {/* Mode pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          borderRadius: 99,
          backgroundColor: isMockMode ? 'rgba(244,162,97,0.2)' : 'rgba(82,183,136,0.2)',
          border: `1px solid ${isMockMode ? 'rgba(244,162,97,0.4)' : 'rgba(82,183,136,0.4)'}`,
        }}>
          <span className="pulse-dot" style={{
            display: 'inline-block',
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: isMockMode ? '#f4a261' : '#52b788',
          }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
            {isMockMode ? 'Demo Mode — AWS not connected' : 'Live — AWS Connected'}
          </span>
          <Zap size={13} color={isMockMode ? '#f4a261' : '#52b788'} />
        </div>
      </div>

      {/* ── Error banner ── */}
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

      {/* ── Stat cards ── */}
      <section aria-label="Summary statistics" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {loading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          <>
            <StatCard
              id="stat-heat-risk"
              icon={ThermometerSun}
              label="Heat Risk Level"
              value={riskLevel}
              subtitle={`${HEAT_RISK_SUMMARY.feelsLike} feels-like · sample`}
              accentColor={riskAccent}
            />
            <StatCard
              id="stat-water-points"
              icon={Droplets}
              label="Water Points"
              value={waterPoints.length}
              subtitle={`${brokenCount} reported broken`}
              accentColor="var(--forest)"
            />
            <StatCard
              id="stat-open-incidents"
              icon={AlertTriangle}
              label="Open Incidents"
              value={openCount}
              subtitle={`${reports.length} total reports`}
              accentColor="var(--accent)"
            />
          </>
        )}
      </section>

      {/* ── Heat advisory banner ── */}
      {!loading && (
        <div className="fade-up" style={{
          backgroundColor: riskBg,
          border: `1px solid ${riskAccent}40`,
          borderLeft: `4px solid ${riskAccent}`,
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem 1.2rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            backgroundColor: `${riskAccent}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <ThermometerSun size={18} color={riskAccent} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: riskAccent, marginBottom: 2 }}>
              Heat Advisory — {riskLevel} Risk
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-md)' }}>{HEAT_RISK_SUMMARY.advisory}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 4, fontStyle: 'italic' }}>
              {HEAT_RISK_SUMMARY.disclaimer}
            </div>
          </div>
        </div>
      )}

      {/* ── Map + Sidebar ── */}
      <section aria-label="Heat risk map" style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 14, marginBottom: '1.5rem' }}>
        <div style={{ minWidth: 0 }}>
          {loading
            ? <div className="skeleton" style={{ height: 450, borderRadius: 'var(--radius-lg)' }} />
            : <HeatRiskMap waterPoints={waterPoints} />
          }
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <RiskLegend />

          {/* Water status breakdown */}
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
                💧 Water Status
              </h3>
            </div>
            <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { status: 'operational', label: 'Operational', color: '#52b788', bg: '#e8f7ef' },
                { status: 'low-supply',  label: 'Low Supply',  color: '#f4a261', bg: '#fef3e6' },
                { status: 'broken',      label: 'Broken',      color: '#c1121f', bg: '#fde8e8' },
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
              transition: 'opacity 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = 0.92; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = 1;    e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <MapPin size={17} />
            Report a Problem
          </Link>
        </div>
      </section>

      {/* ── Recent Reports ── */}
      <section aria-label="Recent reports" style={{ marginBottom: '2.5rem' }}>
        <RecentReports reports={reports} />
      </section>

      {/* ── AWS Integration Status Banner ── */}
      <div style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        marginBottom: '1rem',
      }}>
        <div style={{
          padding: '0.8rem 1.25rem',
          background: 'var(--border-lt)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Zap size={15} color="var(--muted)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            AWS Integration Status
          </span>
        </div>
        <div style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { service: 'API Gateway',  status: 'pending', note: 'Set VITE_API_URL in .env' },
            { service: 'Lambda',       status: 'pending', note: 'Functions not deployed' },
            { service: 'DynamoDB',     status: 'pending', note: 'Tables not created' },
            { service: 'SNS',          status: 'pending', note: 'Notifications not wired' },
          ].map(({ service, status, note }) => (
            <div key={service} style={{
              padding: '0.7rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--card)',
              display: 'flex', alignItems: 'flex-start', gap: 8,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                backgroundColor: status === 'connected' ? '#52b788' : '#f4a261',
                marginTop: 5, flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>{service}</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--muted)' }}>{note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
