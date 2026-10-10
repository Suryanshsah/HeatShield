import { Droplets, Moon, Shield, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ theme, toggleTheme }) {
  const { pathname } = useLocation();

  const navItems = [
    { to: '/',       label: 'Dashboard' },
    { to: '/report', label: 'Report Water Issue' },
  ];

  return (
    <header style={{
      backgroundColor: 'var(--brand-navy)',
      color: '#ffffff',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{
        maxWidth: 1240,
        margin: '0 auto',
        padding: '0 1rem',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo & Name */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#ffffff' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--brand-aqua)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f2e35',
            boxShadow: '0 2px 8px rgba(0,168,150,0.4)',
          }}>
            <Shield size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
                Heat<span style={{ color: 'var(--brand-aqua)' }}>Shield</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 4,
                backgroundColor: 'rgba(0,168,150,0.2)',
                color: 'var(--brand-aqua)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Delhi
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
              Heat &amp; Water Resilience
            </div>
          </div>
        </Link>

        {/* Desktop Navigation & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <nav style={{ display: 'none' }} className="md-nav">
            {navItems.map(({ to, label }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#ffffff' : 'rgba(255,255,255,0.75)',
                    backgroundColor: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                    marginRight: 4,
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.15)',
              backgroundColor: 'rgba(255,255,255,0.08)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            {theme === 'dark' ? <Sun size={20} color="#f4d35e" /> : <Moon size={20} color="#e0f7f5" />}
          </button>

          {/* Direct CTA button (Desktop) */}
          <Link
            to="/report"
            className="md-cta"
            style={{
              padding: '9px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--brand-aqua)',
              color: '#0f2e35',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'none',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 10px rgba(0,168,150,0.3)',
              transition: 'transform var(--transition-fast)',
            }}
          >
            <Droplets size={16} />
            Report Problem
          </Link>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .md-nav { display: flex !important; }
          .md-cta { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
