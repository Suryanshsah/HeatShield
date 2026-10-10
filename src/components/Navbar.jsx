import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplets, Globe, Menu, ShieldCheck, ThermometerSnowflake, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { to: '/',       label: t('dashboard') },
    { to: '/report', label: t('reportProblem') },
    { to: '/cooling-centers', label: t('coolingShelters'), icon: ThermometerSnowflake },
    { to: '/admin',  label: t('adminPortal'), icon: ShieldCheck },
  ];

  return (
    <header style={{
      background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
      color: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 16px rgba(27,67,50,0.35)',
    }}>
      <div style={{
        maxWidth: 1240,
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff' }}>
          <div style={{
            background: 'linear-gradient(135deg, #74c69d, #52b788)',
            borderRadius: 10,
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            <Droplets size={20} color="#1b4332" strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.03em' }}>
              Heat<span style={{ color: '#74c69d' }}>Shield</span>
            </span>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: -2 }}>
              {t('subTitle')}
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: 6, alignItems: 'center' }} className="hs-desktop-nav">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                id={`nav-${label.replace(/\s+/g, '-').toLowerCase()}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: '0.86rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#fff' : 'rgba(255,255,255,0.75)',
                  background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                  border: active ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                  transition: 'all 0.18s ease',
                }}
              >
                {Icon && <Icon size={14} color={active ? '#74c69d' : 'rgba(255,255,255,0.7)'} />}
                {label}
              </Link>
            );
          })}

          {/* Language Selector Button */}
          <button
            onClick={toggleLanguage}
            title="Switch Language (English / हिंदी)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.3)',
              backgroundColor: 'rgba(0,0,0,0.2)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginLeft: 4,
            }}
          >
            <Globe size={14} color="#74c69d" />
            {lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
          </button>

          {/* CTA button */}
          <Link
            to="/report"
            id="nav-cta-report"
            style={{
              marginLeft: 8,
              padding: '8px 18px',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(135deg, #e76f51, #d4602a)',
              boxShadow: '0 2px 10px rgba(231,111,81,0.4)',
              transition: 'opacity 0.18s',
            }}
          >
            + {t('reportProblem')}
          </Link>
        </nav>

        {/* Mobile controls */}
        <div style={{ display: 'none', alignItems: 'center', gap: 8 }} className="hs-mobile-controls">
          <button
            onClick={toggleLanguage}
            style={{
              padding: '5px 10px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.3)',
              backgroundColor: 'rgba(0,0,0,0.2)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 EN'}
          </button>
          
          <button
            id="nav-mobile-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.12)',
          padding: '0.75rem 1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          backgroundColor: '#1b4332',
        }}>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                borderRadius: 8,
                color: pathname === to ? '#74c69d' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                fontWeight: pathname === to ? 700 : 500,
                fontSize: '0.92rem',
                background: pathname === to ? 'rgba(255,255,255,0.08)' : 'transparent',
              }}
            >
              {Icon && <Icon size={16} />}
              {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 840px) {
          .hs-desktop-nav { display: none !important; }
          .hs-mobile-controls { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
