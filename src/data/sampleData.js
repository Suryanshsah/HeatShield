/**
 * SAMPLE DATA — For demonstration purposes only.
 * These are NOT real or verified water-point locations or risk scores.
 */

export const SAMPLE_WATER_POINTS = [
  { id: 'wp-1', name: 'Nehru Place Community Tap', lat: 28.5494, lng: 77.2510, status: 'operational', type: 'Community Tap' },
  { id: 'wp-2', name: 'Saket Water Kiosk',         lat: 28.5200, lng: 77.2100, status: 'low-supply',   type: 'Water Kiosk' },
  { id: 'wp-3', name: 'Lajpat Nagar Public Tap',   lat: 28.5700, lng: 77.2400, status: 'broken',       type: 'Public Tap' },
  { id: 'wp-4', name: 'Connaught Place Fountain',  lat: 28.6315, lng: 77.2167, status: 'operational', type: 'Fountain' },
  { id: 'wp-5', name: 'Karol Bagh Tanker Point',   lat: 28.6520, lng: 77.1900, status: 'operational', type: 'Tanker Point' },
  { id: 'wp-6', name: 'Chandni Chowk Water Booth', lat: 28.6560, lng: 77.2310, status: 'low-supply',   type: 'Water Booth' },
  { id: 'wp-7', name: 'Dwarka Sec-10 Tap',         lat: 28.5730, lng: 77.0550, status: 'operational', type: 'Community Tap' },
  { id: 'wp-8', name: 'Rohini Sector 3 Kiosk',     lat: 28.7380, lng: 77.0740, status: 'broken',       type: 'Water Kiosk' },
];

export const SAMPLE_REPORTS = [
  {
    id: 'rpt-1',
    issueType: 'broken-tap',
    description: 'Tap at Lajpat Nagar bus stand is completely broken. Water is wasting.',
    lat: 28.5700, lng: 77.2400,
    status: 'open',
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 'rpt-2',
    issueType: 'water-unavailable',
    description: 'No water supply for last 3 days in Saket block C area.',
    lat: 28.5200, lng: 77.2100,
    status: 'open',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'rpt-3',
    issueType: 'leaking-pipe',
    description: 'Underground pipe near Rohini Sector 3 is leaking heavily.',
    lat: 28.7380, lng: 77.0740,
    status: 'open',
    timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
  },
  {
    id: 'rpt-4',
    issueType: 'cooling-unavailable',
    description: 'Cooling centre at Connaught Place metro exit is shut.',
    lat: 28.6315, lng: 77.2167,
    status: 'acknowledged',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'rpt-5',
    issueType: 'broken-tap',
    description: 'Chandni Chowk water booth handle snapped off.',
    lat: 28.6560, lng: 77.2310,
    status: 'open',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

/** Approximate heat-risk zones for Delhi (sample, not scientifically validated) */
export const SAMPLE_HEAT_ZONES = [
  {
    id: 'hz-1', name: 'Central Delhi',
    bounds: [[28.62, 77.17], [28.67, 77.27]],
    risk: 'severe', colour: '#d62828',
  },
  {
    id: 'hz-2', name: 'South Delhi',
    bounds: [[28.50, 77.18], [28.60, 77.28]],
    risk: 'high', colour: '#e76f51',
  },
  {
    id: 'hz-3', name: 'West Delhi',
    bounds: [[28.60, 77.05], [28.68, 77.15]],
    risk: 'moderate', colour: '#f4a261',
  },
  {
    id: 'hz-4', name: 'North-East Delhi',
    bounds: [[28.68, 77.25], [28.76, 77.35]],
    risk: 'high', colour: '#e76f51',
  },
  {
    id: 'hz-5', name: 'Dwarka / South-West',
    bounds: [[28.54, 77.02], [28.61, 77.10]],
    risk: 'low', colour: '#52b788',
  },
];

export const HEAT_RISK_SUMMARY = {
  level: 'High',       // sample value
  feelsLike: '42 °C',  // sample value
  advisory: 'Limit outdoor activity between 11 am – 5 pm. Carry water at all times.',
  disclaimer: 'This heat-risk data is illustrative sample data and is NOT verified or real-time.',
};
