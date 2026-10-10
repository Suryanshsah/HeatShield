import PlacesMapList from '../components/PlacesMapList';

export default function FindReliefPage({
  waterPoints,
  reports,
  userLocation,
  radius,
  setRadius,
  heatRiskLevel,
  onConfirmWaterStatus,
  t,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
      <div>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6FD3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          REAL-TIME LOCAL RESOURCES
        </span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em', margin: '4px 0' }}>
          {t.findReliefTitle}
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {t.findReliefSubtitle}
        </p>
      </div>

      <PlacesMapList
        waterPoints={waterPoints}
        reports={reports}
        userLocation={{ lat: userLocation?.lat || 28.6139, lng: userLocation?.lng || 77.2090 }}
        radius={radius}
        setRadius={setRadius}
        heatRiskLevel={heatRiskLevel}
        onConfirmWaterStatus={onConfirmWaterStatus}
        t={t}
      />
    </div>
  );
}
