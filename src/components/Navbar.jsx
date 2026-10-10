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
      backgroundColor: 'var(--color-forest-dk)',
      color: '#fff',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff' }}>
          <div style={{
            backgroundColor: 'var(--color-leaf)',
            borderRadius: 8,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Droplets size={20} color="#1b4332" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
            Heat<span style={{ color: 'var(--color-leaf)' }}>Shield</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: 8 }} className="desktop-nav">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              id={`nav-${label.replace(/\s+/g, '-').toLowerCase()}`}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: pathname === to ? '#fff' : 'rgba(255,255,255,0.75)',
                backgroundColor: pathname === to ? 'rgba(255,255,255,0.15)' : 'transparent',
                transition: 'background 0.2s',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          id="nav-mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'none' }}
          aria-label="Toggle menu"
          className="mobile-menu-btn"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.15)',
          paddingBottom: 12,
        }}>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '10px 0',
                color: pathname === to ? 'var(--color-leaf)' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.95rem',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
