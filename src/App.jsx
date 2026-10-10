import { useEffect, useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import AdminPortal from './components/AdminPortal';
import CoolingCenterTracker from './components/CoolingCenterTracker';
import { useGeolocation } from './hooks/useGeolocation';
import { useLiveWeather } from './hooks/useLiveWeather';
import { useWaterPoints } from './hooks/useWaterPoints';
import FindReliefPage from './pages/FindReliefPage';
import OverviewPage from './pages/OverviewPage';
import ReportPage from './pages/ReportPage';
import StaySafePage from './pages/StaySafePage';
import { getReports } from './services/api';
import { translations } from './i18n/translations';

export default function App() {
  // Navigation tab: 'overview' | 'find-relief' | 'report' | 'cooling' | 'admin' | 'stay-safe'
  const [activeTab, setActiveTab] = useState('overview');

  // i18n Language: 'en' | 'hi'
  const [lang, setLang] = useState('en');

  // Theme: 'dark' (default reference style) | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('heatshield_theme') || 'dark';
  });

  // Location handling hook
  const {
    selectedLocation,
    setSelectedLocation,
    requestBrowserLocation,
  } = useGeolocation();

  // Custom live weather hook (Open-Meteo with 10-min refetch)
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useLiveWeather(selectedLocation.lat, selectedLocation.lng);

  // Custom real-time water points hook
  const {
    waterPoints,
    loading: waterLoading,
    radius,
    setRadius,
    refetch: refetchWaterPoints,
    confirmStatus: confirmWaterStatus,
  } = useWaterPoints(selectedLocation.lat, selectedLocation.lng, 1000);

  // Community reports state
  const [reports, setReports] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('heatshield_theme', theme);
  }, [theme]);

  useEffect(() => {
    getReports().then(data => setReports(data)).catch(() => {});
  }, []);

  function toggleTheme() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }

  function handleReportSubmitted(newReport) {
    setReports(prev => [newReport, ...prev]);
    // Re-trigger water points to apply any instant status downgrades from nearby reports
    refetchWaterPoints();
  }

  function handleReportConfirmed(reportId, newCount) {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, confirmations: newCount } : r));
  }

  const t = translations[lang] || translations.en;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-app)',
      color: 'var(--text-main)',
      transition: 'background-color var(--transition-fast)',
    }}>
      {/* Header with searchable location picker, geolocation, language & theme toggle */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        onRequestGeoLocation={requestBrowserLocation}
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: 1200, width: '100%', margin: '0 auto', padding: '1.75rem 1.25rem' }}>
        {activeTab === 'overview' && (
          <OverviewPage
            weather={weather}
            weatherLoading={weatherLoading}
            weatherError={weatherError}
            refetchWeather={refetchWeather}
            selectedLocation={selectedLocation}
            waterPoints={waterPoints}
            waterLoading={waterLoading}
            radius={radius}
            setRadius={setRadius}
            reports={reports}
            onConfirmWaterStatus={confirmWaterStatus}
            onNavigateTab={setActiveTab}
            t={t}
          />
        )}

        {activeTab === 'find-relief' && (
          <FindReliefPage
            waterPoints={waterPoints}
            reports={reports}
            userLocation={selectedLocation}
            radius={radius}
            setRadius={setRadius}
            heatRiskLevel={weather?.risk?.level || 'High'}
            onConfirmWaterStatus={confirmWaterStatus}
            t={t}
          />
        )}

        {activeTab === 'report' && (
          <ReportPage
            reports={reports}
            onReportSubmitted={handleReportSubmitted}
            onReportConfirmed={handleReportConfirmed}
            onBackToMap={() => setActiveTab('find-relief')}
            t={t}
          />
        )}

        {activeTab === 'cooling' && (
          <CoolingCenterTracker />
        )}

        {activeTab === 'admin' && (
          <AdminPortal />
        )}

        {activeTab === 'stay-safe' && (
          <StaySafePage t={t} />
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onNavigateSafety={() => setActiveTab('stay-safe')}
      />
    </div>
  );
}
