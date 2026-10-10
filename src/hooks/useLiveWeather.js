import { useCallback, useEffect, useState } from 'react';
import { getLiveWeather } from '../services/weather';

export function useLiveWeather(lat, lng) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    if (!lat || !lng) return;
    setLoading(true);
    setError(null);

    try {
      const data = await getLiveWeather(lat, lng);
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }, [lat, lng]);

  useEffect(() => {
    fetchWeather();

    // 10-minute refetch interval
    const interval = setInterval(() => {
      fetchWeather();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchWeather]);

  return { weather, loading, error, refetch: fetchWeather };
}
