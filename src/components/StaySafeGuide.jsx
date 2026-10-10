import { AlertOctagon, AlertTriangle, CheckCircle2, Droplets, Heart, HelpCircle, PhoneCall, ShieldCheck, Sun, Users } from 'lucide-react';

export default function StaySafeGuide({ t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">

      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--brand-navy)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        color: '#ffffff',
        borderLeft: '6px solid #6FD3B8',
        boxShadow: 'var(--shadow-md)',
      }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6FD3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {t.staySafeEyebrow}
        </span>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.025em', margin: '4px 0 6px' }}>
          {t.staySafeTitle}
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>
          {t.staySafeSubtitle}
        </p>
      </div>

      {/* Grid of 4 Core Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>

        {/* 1. Heat Illness Signs */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(249, 87, 56, 0.15)', color: '#F95738', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertOctagon size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Recognizing Heat Illness
            </h3>
          </div>

          <div style={{ fontSize: '0.84rem', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ padding: '8px 10px', borderRadius: 8, backgroundColor: 'rgba(238, 150, 75, 0.12)', borderLeft: '3px solid #EE964B' }}>
              <strong style={{ color: '#EE964B' }}>Heat Exhaustion:</strong> Heavy sweating, dizziness, nausea, fast pulse. Move to cool room, sip water.
            </div>
            <div style={{ padding: '8px 10px', borderRadius: 8, backgroundColor: 'rgba(249, 87, 56, 0.15)', borderLeft: '3px solid #F95738' }}>
              <strong style={{ color: '#F95738' }}>Heat Stroke (Emergency!):</strong> High body temp (103°F+), confusion, dry skin, fainting. Call 112 immediately.
            </div>
          </div>
        </div>

        {/* 2. Hydration Best Practices */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'var(--brand-aqua-light)', color: 'var(--brand-aqua-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Hydration Guidelines
            </h3>
          </div>

          <ul style={{ listStyle: 'none', fontSize: '0.84rem', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <CheckCircle2 size={16} color="#6FD3B8" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>Drink 1 cup of water every 20 minutes when outdoors.</span>
            </li>
            <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <CheckCircle2 size={16} color="#6FD3B8" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>Avoid sugary drinks or excessive caffeine in extreme heat.</span>
            </li>
            <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <CheckCircle2 size={16} color="#6FD3B8" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>Add electrolytes or ORS if sweating heavily over 1 hour.</span>
            </li>
          </ul>
        </div>

        {/* 3. Who to Check On */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'var(--bg-surface-subtle)', color: '#6FD3B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Neighbourhood Care List
            </h3>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-sub)', lineHeight: 1.45 }}>
            Check twice daily on vulnerable community members:
          </p>

          <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <li>👵 Elderly neighbours living alone</li>
            <li>👶 Infants and young children</li>
            <li>👷 Outdoor delivery &amp; construction workers</li>
            <li>🐾 Street animals and pets needing water bowls</li>
          </ul>
        </div>

        {/* 4. Emergency Helplines */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'var(--brand-aqua-light)', color: 'var(--brand-aqua-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PhoneCall size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Emergency Contacts
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 6 }}>
              <span style={{ fontWeight: 700 }}>National Emergency:</span>
              <span style={{ fontWeight: 800, color: '#6FD3B8' }}>112</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 6 }}>
              <span style={{ fontWeight: 700 }}>Ambulance Services:</span>
              <span style={{ fontWeight: 800, color: '#6FD3B8' }}>102</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 6 }}>
              <span style={{ fontWeight: 700 }}>Delhi Jal Board Water Hotline:</span>
              <span style={{ fontWeight: 800, color: '#6FD3B8' }}>1916</span>
            </div>
          </div>
        </div>

      </div>

      {/* Emergency Notice Card */}
      <div style={{
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(238, 150, 75, 0.12)',
        border: '1px solid #EE964B',
        color: 'var(--text-main)',
        fontSize: '0.88rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <AlertTriangle size={20} color="#EE964B" style={{ flexShrink: 0 }} />
        <span>{t.emergencyNotice}</span>
      </div>
    </div>
  );
}
