import { useEffect, useState } from 'react';
import { getLiveWeather } from '../services/weather';
import { Sun, Thermometer } from 'lucide-react';

export default function LiveTempChip({ lat, lng }) {
  const [tempData, setTempData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!lat || !lng) return;

    setLoading(true);
    getLiveWeather(lat, lng)
      .then((res) => {
        if (mounted) {
          setTempData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [lat, lng]);

  if (loading) {
    return (
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        Fetching temp...
      </span>
    );
  }

  if (!tempData) return null;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 9px',
      borderRadius: 99,
      backgroundColor: 'var(--bg-surface-subtle)',
      border: '1px solid var(--border-color)',
      fontSize: '0.75rem',
      fontWeight: 700,
      color: 'var(--text-main)',
    }}>
      <Thermometer size={12} color={tempData.risk?.color || '#6FD3B8'} />
      <span>{tempData.tempActual}°C</span>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
        · Feels {tempData.tempFeelsLike}°C
      </span>
    </div>
  );
}
