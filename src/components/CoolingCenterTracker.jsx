import { COOLING_CENTERS, TANKER_SCHEDULES } from '../data/sampleData';
import { Clock, MapPin, Phone, ShieldCheck, ThermometerSnowflake, Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CoolingCenterTracker() {
  const { t } = useLanguage();

  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: '1.75rem 1.25rem' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0077b6 0%, #03045e 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem 2rem',
        marginBottom: '1.5rem',
        color: '#fff',
        boxShadow: '0 6px 20px rgba(3,4,94,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ThermometerSnowflake size={26} color="#90e0ef" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 2 }}>
              Delhi Public Cooling Shelters &amp; Water Tanker Schedules
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
              Find air-conditioned public spaces, hydrated shade pavilions, and Delhi Jal Board emergency water tanker dispatch schedules.
            </p>
          </div>
        </div>
      </div>

      {/* 2 Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

        {/* Column 1: Public Cooling Centers */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            🧊 Public Cooling Hubs &amp; Shelters
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {COOLING_CENTERS.map((cc) => (
              <div key={cc.id} style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0077b6', marginBottom: 4 }}>
                  {cc.name}
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-md)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                  <MapPin size={13} color="var(--muted)" />
                  {cc.address}
                </div>

                <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {cc.timing}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Phone size={12} /> {cc.contact}
                  </span>
                </div>

                {/* Facilities badges */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {cc.facilities.map((fac, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backgroundColor: '#e0f3fe',
                      color: '#0284c7',
                      padding: '2px 8px',
                      borderRadius: 99,
                    }}>
                      ✓ {fac}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Emergency Water Tanker Dispatch Schedules */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            🚛 Jal Board Water Tanker Dispatch
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {TANKER_SCHEDULES.map((ts) => (
              <div key={ts.id} style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)' }}>
                    {ts.zone}
                  </div>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700,
                    backgroundColor: ts.status === 'In Transit' ? '#fef3e6' : '#e8f7ef',
                    color: ts.status === 'In Transit' ? '#d4760a' : '#2d6a4f',
                    padding: '3px 9px', borderRadius: 99,
                  }}>
                    {ts.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-md)', marginBottom: 6 }}>
                  <strong>Expected Delivery:</strong> {ts.arrival}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Truck size={14} color="var(--forest)" />
                  Capacity: {ts.capacity} · Emergency Tanker Request Line: 1916 (Delhi Jal Board)
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 760px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
