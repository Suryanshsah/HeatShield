import { Droplets, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/',       label: 'Dashboard' },
    { to: '/report', label: 'Report a Problem' },
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
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: -2 }}>
              Delhi Heat &amp; Water
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="hs-desktop-nav">
          {navLinks.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                id={`nav-${label.replace(/\s+/g, '-').toLowerCase()}`}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
                  transition: 'all 0.18s ease',
                }}
              >
                {label}
              </Link>
            );
          })}

          {/* CTA button */}
          <Link
            to="/report"
            id="nav-cta-report"
            style={{
              marginLeft: 8,
              padding: '8px 20px',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(135deg, #e76f51, #d4a843)',
              boxShadow: '0 2px 8px rgba(231,111,81,0.4)',
              transition: 'opacity 0.18s',
            }}
          >
            + Report
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          id="nav-mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'none', padding: 4 }}
          aria-label="Toggle menu"
          className="hs-mobile-btn"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.12)',
          padding: '0.75rem 1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '10px 12px',
                borderRadius: 8,
                color: pathname === to ? '#74c69d' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                fontWeight: pathname === to ? 700 : 500,
                fontSize: '0.95rem',
                background: pathname === to ? 'rgba(255,255,255,0.08)' : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .hs-desktop-nav { display: none !important; }
          .hs-mobile-btn  { display: block !important; }
        }
      `}</style>
    </header>
  );
}
