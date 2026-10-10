import { AlertTriangle, Droplets, MapPin, ShieldAlert, Sun, ThermometerSun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HEAT_RISK_SUMMARY } from '../data/sampleData';
import { fetchReports, fetchWaterPoints } from '../services/api';
import HeatRiskMap from './HeatRiskMap';
import RecentReports from './RecentReports';
import RiskLegend from './RiskLegend';
import StatCard from './StatCard';

export default function Dashboard({ localReports = [] }) {
  const [waterPoints, setWaterPoints] = useState([]);
  const [fetchedReports, setFetchedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([fetchWaterPoints(), fetchReports()])
      .then(([wps, rpts]) => {
        if (!isMounted) return;
        setWaterPoints(wps);
        setFetchedReports(rpts);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Merge local new submissions seamlessly
  const fetchedIds = new Set(fetchedReports.map(r => r.id));
  const newLocal = localReports.filter(r => !fetchedIds.has(r.id));
  const allReports = [...newLocal, ...fetchedReports];

  const openIncidentsCount = allReports.filter(r => r.status === 'open').length;
  const brokenWaterPoints = waterPoints.filter(w => w.status === 'broken').length;

  // Heat risk badge styling (reserved heat colors)
  const heatVariant = 'heat-high';

  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: '1.25rem 1rem' }} className="animate-fade-in">

      {/* ── Civic Hero Banner ── */}
      <div style={{
        backgroundColor: 'var(--brand-navy)',
        color: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        borderLeft: '6px solid var(--brand-aqua)',
      }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 99,
            backgroundColor: 'rgba(0,168,150,0.18)',
            color: 'var(--brand-aqua)',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: 10,
          }}>
            <ShieldAlert size={14} />
            <span>Civic Environmental Resilience Platform</span>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 6 }}>
            Delhi Heat Risk &amp; Water Access Monitor
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
            Real-time heat hazards overview and community water access point tracking.
          </p>
        </div>

        <Link
          to="/report"
          style={{
            minHeight: 48,
            padding: '12px 24px',
            backgroundColor: 'var(--brand-aqua)',
            color: '#0f2e35',
            borderRadius: 'var(--radius-md)',
            fontWeight: 800,
            fontSize: '0.95rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(0,168,150,0.4)',
          }}
        >
          <MapPin size={18} />
          Report Water Problem
        </Link>
      </div>

      {/* Error alert */}
      {error && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--status-err-bg)',
          color: 'var(--status-err)',
          fontWeight: 700,
          fontSize: '0.88rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <AlertTriangle size={18} />
          Error fetching monitoring data: {error}
        </div>
      )}

      {/* ── Stat Cards Grid ── */}
      <section aria-label="Key Metrics" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 14,
        marginBottom: '1.5rem',
      }}>
        <StatCard
          id="stat-heat-risk"
          icon={ThermometerSun}
          label="Heat Hazard Status"
          value={HEAT_RISK_SUMMARY.level}
          subtitle={`${HEAT_RISK_SUMMARY.tempFeelsLike} Feels Like (Delhi)`}
          badgeText="High Heat Advisory"
          badgeIcon={Sun}
          badgeVariant={heatVariant}
        />

        <StatCard
          id="stat-water-points"
          icon={Droplets}
          label="Active Water Access"
          value={loading ? '...' : waterPoints.length}
          subtitle={`${brokenWaterPoints} currently reported out of service`}
          badgeText="Community Points"
          badgeIcon={Droplets}
          badgeVariant="aqua"
        />

        <StatCard
          id="stat-open-incidents"
          icon={AlertTriangle}
          label="Open Water Issues"
          value={loading ? '...' : openIncidentsCount}
          subtitle={`${allReports.length} total logged incidents`}
          badgeText="Requires Action"
          badgeIcon={AlertTriangle}
          badgeVariant="neutral"
        />
      </section>

      {/* ── Active Advisory Banner ── */}
      <div style={{
        backgroundColor: 'var(--heat-high-bg)',
        border: '1px solid var(--heat-high)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--heat-high)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Sun size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#b91c1c' }}>
              Official Heat Action Advisory
            </span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 4,
              backgroundColor: '#b91c1c',
              color: '#ffffff',
            }}>
              Active
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>
            {HEAT_RISK_SUMMARY.advisory}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
            {HEAT_RISK_SUMMARY.disclaimer}
          </p>
        </div>
      </div>

      {/* ── Map and Heat Scale Layout ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 16,
        marginBottom: '1.5rem',
      }} className="map-grid">
        <HeatRiskMap waterPoints={waterPoints} />
        <RiskLegend />
      </div>

      {/* ── Recent Reports Feed ── */}
      <section aria-label="Recent Reports" style={{ marginBottom: '2rem' }}>
        <RecentReports reports={allReports} />
      </section>

      <style>{`
        @media (min-width: 992px) {
          .map-grid {
            grid-template-columns: 2fr 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
