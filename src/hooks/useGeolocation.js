import { useState } from 'react';

export const SAVED_AREAS = [
  { name: 'Park Street, Delhi', lat: 28.6180, lng: 77.2150 },
  { name: 'Central Maidan, Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Lajpat Nagar, Delhi', lat: 28.5700, lng: 77.2400 },
  { name: 'Connaught Place, Delhi', lat: 28.6315, lng: 77.2167 },
  { name: 'Nehru Place, Delhi', lat: 28.5494, lng: 77.2510 },
  { name: 'Saket District, Delhi', lat: 28.5284, lng: 77.2185 },
];

export function useGeolocation() {
  const [selectedLocation, setSelectedLocation] = useState(SAVED_AREAS[0]);
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);

  const requestBrowserLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSelectedLocation({
          name: 'Current Location',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          isLiveGeo: true,
        });
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation permission denied or error:', err.message);
        setGeoError('Location permission denied. Defaulting to Park Street, Delhi.');
        setSelectedLocation(SAVED_AREAS[0]);
        setLoading(false);
      },
      { timeout: 8000 }
    );
  };

  return {
    selectedLocation,
    setSelectedLocation,
    loading,
    geoError,
    requestBrowserLocation,
    savedAreas: SAVED_AREAS,
  };
}
