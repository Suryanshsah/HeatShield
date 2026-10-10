/**
 * WATER POINTS DATA & HELPER UTILITIES — HeatShield
 * Real-time style drinking water points with distance calculation & report reaction logic.
 */

export const WATER_POINTS_DATA = [
  {
    id: 'wp-1',
    name: 'Maidan drinking water dispenser',
    type: 'tap',
    typeName: 'Public Tap Dispenser',
    lat: 28.6139,
    lng: 77.2090,
    status: 'Available',
    lastConfirmed: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 min ago
    confirmations: 18,
    isFree: true,
    accessibility: true, // step-free
    openHours: 'Open 24 hours',
    notes: 'Chilled RO water dispenser with 4 high-flow taps.',
  },
  {
    id: 'wp-2',
    name: 'Park Street Metro refill kiosk',
    type: 'refill',
    typeName: 'Refill Kiosk',
    lat: 28.6220,
    lng: 77.2040,
    status: 'Low flow',
    lastConfirmed: new Date(Date.now() - 1000 * 60 * 28).toISOString(), // 28 min ago
    confirmations: 9,
    isFree: true,
    accessibility: true,
    openHours: '6:00 AM – 10:00 PM',
    notes: 'Purified bottle refill kiosk. Pressure lower during peak hours.',
  },
  {
    id: 'wp-3',
    name: 'Lajpat Nagar Market water fountain',
    type: 'fountain',
    typeName: 'Drinking Fountain',
    lat: 28.5700,
    lng: 77.2400,
    status: 'Not working',
    lastConfirmed: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
    confirmations: 24,
    isFree: true,
    accessibility: false,
    openHours: 'Open 24 hours',
    notes: 'Tap valve damaged. Reported dry by community.',
  },
  {
    id: 'wp-4',
    name: 'Nehru Place Bus Stand tanker',
    type: 'tanker',
    typeName: 'Emergency Water Tanker',
    lat: 28.5494,
    lng: 77.2510,
    status: 'Available',
    lastConfirmed: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    confirmations: 31,
    isFree: true,
    accessibility: true,
    openHours: '8:00 AM – 8:00 PM',
    notes: 'Municipal emergency tanker stationed during summer high heat advisories.',
  },
  {
    id: 'wp-5',
    name: 'Connaught Place Palika concourse tap',
    type: 'tap',
    typeName: 'Public Tap Dispenser',
    lat: 28.6315,
    lng: 77.2167,
    status: 'Available',
    lastConfirmed: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 min ago
    confirmations: 15,
    isFree: true,
    accessibility: true,
    openHours: '10:00 AM – 9:00 PM',
    notes: 'Clean drinking tap in underground concourse entrance.',
  },
  {
    id: 'wp-6',
    name: 'Lodhi Garden heritage well dispenser',
    type: 'well',
    typeName: 'Community Well Tap',
    lat: 28.5931,
    lng: 77.2197,
    status: 'Available',
    lastConfirmed: new Date(Date.now() - 1000 * 60 * 52).toISOString(), // 52 min ago
    confirmations: 7,
    isFree: true,
    accessibility: false,
    openHours: '5:00 AM – 8:00 PM',
    notes: 'Shaded stone well tap system.',
  },
  {
    id: 'wp-7',
    name: 'Saket District Centre water station',
    type: 'refill',
    typeName: 'Refill Kiosk',
    lat: 28.5284,
    lng: 77.2185,
    status: 'Unknown',
    lastConfirmed: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    confirmations: 2,
    isFree: true,
    accessibility: true,
    openHours: 'Open 24 hours',
    notes: 'Pending neighbour verification today.',
  },
  {
    id: 'wp-8',
    name: 'Taltala Public Cooling Tap',
    type: 'tap',
    typeName: 'Public Tap Dispenser',
    lat: 28.6180,
    lng: 77.2150,
    status: 'Available',
    lastConfirmed: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    confirmations: 14,
    isFree: true,
    accessibility: true,
    openHours: 'Open 24 hours',
    notes: 'Filtered cold water dispenser outside community hall.',
  },
];

/**
 * Haversine Distance Formula in Meters
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculate Walking Time (approx 80 meters per minute)
 */
export function calculateWalkTime(meters) {
  const mins = Math.max(1, Math.round(meters / 80));
  return `${mins} min walk`;
}
