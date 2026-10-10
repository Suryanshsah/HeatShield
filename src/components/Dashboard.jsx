import { AlertTriangle, Droplets, MapPin, ThermometerSun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HEAT_RISK_SUMMARY } from '../data/sampleData';
import { fetchReports, fetchWaterPoints } from '../services/api';
import HeatRiskMap from './HeatRiskMap';
import RecentReports from './RecentReports';
import RiskLegend from './RiskLegend';
import StatCard from './StatCard';

const RISK_ACCENT = {
  Low:      'var(--color-low)',
  Moderate: 'var(--color-moderate)',
  High:     'var(--color-high)',
  Severe:   'var(--color-severe)',
};

export default function Dashboard({ localReports = [] }) {
  const [waterPoints,  setWaterPoints] = useState([]);
  const [fetchedReports, setFetchedReports] = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [fetchError,   setFetchError]  = useState(null);

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

  // Merge prop-injected local (newly submitted) reports with fetched ones, deduplicating by id
  const fetchedIds = new Set(fetchedReports.map((r) => r.id));
  const newLocal   = localReports.filter((r) => !fetchedIds.has(r.id));
  const reports    = [...newLocal, ...fetchedReports];

  const openCount   = reports.filter((r) => r.status === 'open').length;
  const brokenCount = waterPoints.filter((w) => w.status === 'broken').length;
  const riskAccent  = RISK_ACCENT[HEAT_RISK_SUMMARY.level] || 'var(--color-high)';

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1.25rem' }}>

      {/* Page heading */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
          Community Dashboard
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)' }}>
          Delhi heat-risk overview and water-access status — <em>sample data, not verified or real-time</em>.
        </p>
      </div>

      {/* Fetch error */}
      {fetchError && (
        <div style={{
          padding: '10px 16px',
          backgroundColor: '#fce4e4',
          border: '1px solid #d62828',
          borderRadius: 8,
          color: '#d62828',
          fontSize: '0.85rem',
          marginBottom: '1rem',
        }}>
          ⚠ Could not load data: {fetchError}
        </div>
      )}

      {/* Stat cards */}
      <section aria-label="Summary statistics" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <StatCard
          id="stat-heat-risk"
          icon={ThermometerSun}
          label="Heat Risk Level"
          value={loading ? '…' : HEAT_RISK_SUMMARY.level}
          subtitle={loading ? undefined : HEAT_RISK_SUMMARY.feelsLike + ' feels-like (sample)'}
          accentColor={riskAccent}
        />
        <StatCard
          id="stat-water-points"
          icon={Droplets}
          label="Water Points"
          value={loading ? '…' : waterPoints.length}
          subtitle={loading ? undefined : `${brokenCount} reported broken`}
          accentColor="var(--color-forest)"
        />
        <StatCard
          id="stat-open-incidents"
          icon={AlertTriangle}
          label="Open Incidents"
          value={loading ? '…' : openCount}
          subtitle={loading ? undefined : `${reports.length} total reports`}
          accentColor="var(--color-accent)"
        />
      </section>

      {/* Heat advisory banner */}
      <div style={{
        backgroundColor: `${riskAccent}12`,
        border: `1px solid ${riskAccent}`,
        borderRadius: 10,
        padding: '0.75rem 1.1rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
      }}>
        <ThermometerSun size={18} color={riskAccent} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: riskAccent }}>Advisory: </span>
          <span style={{ fontSize: '0.88rem', color: 'var(--color-text)' }}>{HEAT_RISK_SUMMARY.advisory}</span>
          <div style={{ fontSize: '0.74rem', color: 'var(--color-muted)', marginTop: 2, fontStyle: 'italic' }}>
            {HEAT_RISK_SUMMARY.disclaimer}
          </div>
        </div>
      </div>

      {/* Map + Legend */}
      <section aria-label="Heat risk map" style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 16, marginBottom: '1.5rem' }}>
        <div style={{ minWidth: 0 }}>
          {loading
            ? <div style={{ height: 420, backgroundColor: 'var(--color-card)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>Loading map…</div>
            : <HeatRiskMap waterPoints={waterPoints} />
          }
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <RiskLegend />
          {/* Water-point status summary */}
          <div style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 12,
            padding: '1rem 1.25rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              Water Status
            </h3>
            {[
              { status: 'operational', label: 'Operational', color: 'var(--color-low)' },
              { status: 'low-supply',  label: 'Low Supply',  color: 'var(--color-moderate)' },
              { status: 'broken',      label: 'Broken',      color: 'var(--color-danger)' },
            ].map(({ status, label, color }) => {
              const count = waterPoints.filter((w) => w.status === status).length;
              return (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.84rem', color: 'var(--color-text)' }}>{label}</span>
                  <span style={{
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color,
                  }}>{loading ? '—' : count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent reports + CTA */}
      <section aria-label="Recent reports" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start', marginBottom: '2rem' }}>
        <RecentReports reports={reports} />

        <Link
          to="/report"
          id="cta-report-problem"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 22px',
            backgroundColor: 'var(--color-accent)',
            color: '#fff',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            boxShadow: '0 2px 8px rgba(231,111,81,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          <MapPin size={18} />
          Report a Problem
        </Link>
      </section>

      <style>{`
        @media (max-width: 800px) {
          section[aria-label="Heat risk map"]   { grid-template-columns: 1fr !important; }
          section[aria-label="Recent reports"]  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
