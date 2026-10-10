import { useState } from 'react';
import { ChevronDown, Compass, Droplets, Globe, MapPin, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { SAVED_AREAS } from '../hooks/useGeolocation';
import { translations } from '../i18n/translations';

export default function Header({
  activeTab,
  setActiveTab,
  selectedLocation,
  setSelectedLocation,
  onRequestGeoLocation,
  lang,
  setLang,
  theme,
  toggleTheme,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const t = translations[lang] || translations.en;

  const tabs = [
    { id: 'overview',   label: t.tabOverview },
    { id: 'find-relief',label: t.tabFindRelief },
    { id: 'report',     label: t.tabReport },
    { id: 'stay-safe',  label: t.tabStaySafe },
  ];

  const filteredAreas = SAVED_AREAS.filter(area =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header style={{
      backgroundColor: 'var(--bg-app)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'background-color var(--transition-fast)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 1.25rem',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Brand Logo & Wordmark */}
        <div
          onClick={() => setActiveTab('overview')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            backgroundColor: '#6FD3B8',
            color: '#07201F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(111, 211, 184, 0.3)',
          }}>
            <Droplets size={22} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em' }}>
            Heat<span style={{ color: '#6FD3B8' }}>Shield</span>
          </span>
        </div>

        {/* Desktop Navigation Tabs with Mint Underline */}
        <nav style={{ display: 'none' }} className="header-desktop-tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  position: 'relative',
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  transition: 'color var(--transition-fast)',
                }}
              >
                {tab.label}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 12,
                    right: 12,
                    height: 3,
                    borderRadius: 99,
                    backgroundColor: '#6FD3B8',
                    boxShadow: '0 0 8px rgba(111, 211, 184, 0.6)',
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Searchable Location Picker + Language + Theme + Mobile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>

          {/* Interactive Location Picker Pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setPickerOpen(!pickerOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 99,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <MapPin size={14} color="#6FD3B8" />
              <span>{selectedLocation?.name || 'Park Street, Delhi'}</span>
              <ChevronDown size={13} color="var(--text-muted)" />
            </button>

            {/* Dropdown Menu */}
            {pickerOpen && (
              <div style={{
                position: 'absolute',
                top: 44,
                right: 0,
                width: 260,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                padding: '10px',
                boxShadow: 'var(--shadow-md)',
                zIndex: 1100,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }} className="animate-fade-in">

                {/* Search Input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <Search size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.8rem', outline: 'none', width: '100%' }}
                  />
                </div>

                {/* Use Current Location Button */}
                <button
                  onClick={() => {
                    onRequestGeoLocation();
                    setPickerOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--brand-aqua-light)',
                    color: 'var(--brand-aqua-dark)',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Compass size={14} />
                  <span>Use my current location</span>
                </button>

                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 6px 0' }}>
                  Saved Neighborhoods
                </div>

                {/* List of Saved Areas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 180, overflowY: 'auto' }}>
                  {filteredAreas.map((area) => (
                    <button
                      key={area.name}
                      onClick={() => {
                        setSelectedLocation(area);
                        setPickerOpen(false);
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: selectedLocation?.name === area.name ? 'var(--bg-surface-subtle)' : 'transparent',
                        color: selectedLocation?.name === area.name ? '#6FD3B8' : 'var(--text-main)',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: selectedLocation?.name === area.name ? 800 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      📍 {area.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            aria-label="Change language"
            title="Switch Language (EN / HI)"
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Globe size={13} color="#6FD3B8" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? <Sun size={17} color="#F4D35E" /> : <Moon size={17} color="#6FD3B8" />}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="header-mobile-toggle"
            aria-label="Toggle Navigation Menu"
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }} className="header-mobile-drawer">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'left',
                backgroundColor: activeTab === tab.id ? 'var(--brand-aqua-light)' : 'transparent',
                color: activeTab === tab.id ? 'var(--brand-aqua-dark)' : 'var(--text-main)',
                border: 'none',
                fontWeight: activeTab === tab.id ? 800 : 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .header-desktop-tabs { display: flex !important; gap: 4px; }
          .header-mobile-toggle { display: none !important; }
        }
        @media (max-width: 767px) {
          .header-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
