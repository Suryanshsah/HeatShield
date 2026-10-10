import { translations } from '../i18n/translations';

export default function Footer({ lang = 'en', onNavigateSafety }) {
  const t = translations[lang] || translations.en;

  return (
    <footer style={{
      backgroundColor: 'var(--bg-app)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '1.75rem 1.25rem 2.5rem',
      marginTop: '3rem',
      transition: 'background-color var(--transition-fast)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
      }}>

        {/* Logo Tagline */}
        <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#6FD3B8' }} />
          <span>{t.footerTagline}</span>
        </div>

        {/* Demo Disclaimer */}
        <div style={{ maxWidth: 480, textAlign: 'center', lineHeight: 1.4 }}>
          {t.footerDisclaimer}
          <div style={{ fontSize: '0.72rem', marginTop: 2, fontStyle: 'italic' }}>
            Built with React, Vite, Tailwind CSS &amp; React Leaflet.
          </div>
        </div>

        {/* Safety & Wellbeing Link */}
        <button
          onClick={onNavigateSafety}
          style={{
            background: 'none',
            border: 'none',
            color: '#6FD3B8',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {t.footerSafetyLink}
        </button>
      </div>
    </footer>
  );
}
