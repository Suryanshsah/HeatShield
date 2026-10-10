import { AlertCircle, Home, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function MobileBottomBar() {
  const { pathname } = useLocation();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 64,
      backgroundColor: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 1000,
      boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
    }} className="mobile-bottom-nav">
      <Link
        to="/"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          color: pathname === '/' ? 'var(--brand-aqua)' : 'var(--text-muted)',
          textDecoration: 'none',
          fontSize: '0.72rem',
          fontWeight: pathname === '/' ? 700 : 500,
          padding: '6px 16px',
        }}
      >
        <Home size={20} />
        <span>Home</span>
      </Link>

      <Link
        to="/report"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: 'var(--brand-aqua)',
          color: '#0f2e35',
          textDecoration: 'none',
          padding: '10px 20px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          fontWeight: 700,
          boxShadow: '0 2px 10px rgba(0,168,150,0.3)',
          marginTop: -10,
        }}
      >
        <PlusCircle size={18} />
        <span>Report Issue</span>
      </Link>

      <a
        href="#incidents-section"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontSize: '0.72rem',
          fontWeight: 500,
          padding: '6px 16px',
        }}
        onClick={(e) => {
          if (pathname !== '/') {
            // navigate home first
            window.location.href = '/#incidents-section';
          }
        }}
      >
        <AlertCircle size={20} />
        <span>Incidents</span>
      </a>

      <style>{`
        @media (min-width: 768px) {
          .mobile-bottom-nav { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
