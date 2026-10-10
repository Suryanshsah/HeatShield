import { useCallback, useEffect, useState } from 'react';
import { confirmWaterPointStatus, getWaterPoints } from '../services/api';

export function useWaterPoints(userLat = 28.6139, userLng = 77.2090, initialRadius = 1000) {
  const [waterPoints, setWaterPoints] = useState([]);
  const [radius, setRadius] = useState(initialRadius); // 500 | 1000 | 2000
  const [loading, setLoading] = useState(true);

  const fetchPoints = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWaterPoints(userLat, userLng, radius);
      setWaterPoints(data);
    } catch (err) {
      console.error('Failed to fetch water points:', err);
    } finally {
      setLoading(false);
    }
  }, [userLat, userLng, radius]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  const confirmStatus = async (waterPointId, newStatus) => {
    const updated = await confirmWaterPointStatus(waterPointId, newStatus);
    setWaterPoints(prev => prev.map(wp => wp.id === waterPointId ? { ...wp, status: newStatus, confirmations: (wp.confirmations || 0) + 1, lastConfirmed: new Date().toISOString(), timeAgoLabel: 'Just now' } : wp));
    return updated;
  };

  return { waterPoints, loading, radius, setRadius, refetch: fetchPoints, confirmStatus };
}
