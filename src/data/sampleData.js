/**
 * SAMPLE DATA — HeatShield Civic Platform
 * Clearly identified as illustrative demo data for the Delhi region.
 */

export const SAMPLE_WATER_POINTS = [
  { id: 'wp-1', name: 'Nehru Place Community Tap', lat: 28.5494, lng: 77.2510, status: 'operational', type: 'Community Tap', capacity: 'High' },
  { id: 'wp-2', name: 'Saket Metro Water Kiosk',    lat: 28.5200, lng: 77.2100, status: 'low-supply',   type: 'Water Kiosk',   capacity: 'Medium' },
  { id: 'wp-3', name: 'Lajpat Nagar Ring Road Tap',lat: 28.5700, lng: 77.2400, status: 'broken',       type: 'Public Tap',    capacity: 'Low' },
  { id: 'wp-4', name: 'Connaught Place Hub Kiosk', lat: 28.6315, lng: 77.2167, status: 'operational', type: 'Cooling Hub',   capacity: 'Very High' },
  { id: 'wp-5', name: 'Karol Bagh Tanker Stand',   lat: 28.6520, lng: 77.1900, status: 'operational', type: 'Tanker Point',  capacity: 'High' },
  { id: 'wp-6', name: 'Chandni Chowk Water Booth', lat: 28.6560, lng: 77.2310, status: 'low-supply',   type: 'Water Booth',   capacity: 'Medium' },
  { id: 'wp-7', name: 'Dwarka Sec-10 Community Tap',lat: 28.5730, lng: 77.0550, status: 'operational', type: 'Community Tap', capacity: 'High' },
  { id: 'wp-8', name: 'Rohini Sec-3 Public Tap',    lat: 28.7380, lng: 77.0740, status: 'broken',       type: 'Public Tap',    capacity: 'Low' },
];

export const SAMPLE_REPORTS = [
  {
    id: 'rpt-1',
    issueType: 'broken-tap',
    issueLabel: 'Broken Water Tap',
    description: 'Bus stand water tap snapped off at Lajpat Nagar. Clean water spilling onto pavement continuously.',
    lat: 28.5700, lng: 77.2400,
    status: 'open',
    statusLabel: 'Action Needed',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    urgency: 'high',
  },
  {
    id: 'rpt-2',
    issueType: 'water-unavailable',
    issueLabel: 'No Water Supply',
    description: 'Block C public taps have zero pressure since 6:00 AM. 40+ families waiting for tanker.',
    lat: 28.5200, lng: 77.2100,
    status: 'open',
    statusLabel: 'Action Needed',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    urgency: 'severe',
  },
  {
    id: 'rpt-3',
    issueType: 'leaking-pipe',
    issueLabel: 'Pipe Leak / Burst',
    description: 'Major main line leakage outside Rohini Sec-3 school gate. Road flooding.',
    lat: 28.7380, lng: 77.0740,
    status: 'acknowledged',
    statusLabel: 'Dispatched',
    timestamp: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    urgency: 'moderate',
  },
  {
    id: 'rpt-4',
    issueType: 'cooling-unavailable',
    issueLabel: 'Cooling Center Closed',
    description: 'Public misting shade at Connaught Place gate 2 power breaker tripped.',
    lat: 28.6315, lng: 77.2167,
    status: 'acknowledged',
    statusLabel: 'Dispatched',
    timestamp: new Date(Date.now() - 1000 * 60 * 340).toISOString(),
    urgency: 'moderate',
  },
  {
    id: 'rpt-5',
    issueType: 'broken-tap',
    issueLabel: 'Broken Water Tap',
    description: 'Chandni Chowk main bazaar drinking station tap valve rusted shut.',
    lat: 28.6560, lng: 77.2310,
    status: 'open',
    statusLabel: 'Action Needed',
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    urgency: 'low',
  },
];

export const COOLING_CENTERS = [
  {
    id: 'cc-1',
    name: 'CP Underground Air-Conditioned Public Hub',
    address: 'Rajiv Chowk Metro Concourse, CP',
    lat: 28.6328, lng: 77.2195,
    timing: '06:00 AM - 10:00 PM',
    facilities: ['Air Conditioned', 'Free Drinking Water', 'First Aid'],
    contact: '011-23412000',
  },
  {
    id: 'cc-2',
    name: 'Lodi Gardens Shaded Pavilion & Hydration Booth',
    address: 'Lodhi Road, Opp. India International Centre',
    lat: 28.5931, lng: 77.2197,
    timing: '24 Hours',
    facilities: ['Shaded Seating', 'Chilled Water Fountain', 'Misting Fan'],
    contact: '1800-11-0011',
  },
  {
    id: 'cc-3',
    name: 'Karol Bagh Community Heat Shelter',
    address: 'Desh Bandhu Gupta Rd, Karol Bagh',
    lat: 28.6508, lng: 77.1935,
    timing: '09:00 AM - 08:00 PM',
    facilities: ['Cooling Fans', 'ORS & Electrolyte Packets', 'Medical Assistant'],
    contact: '011-25721122',
  },
];

export const TANKER_SCHEDULES = [
  { id: 'ts-1', zone: 'South Delhi - Sangam Vihar', arrival: '07:30 AM & 04:30 PM', status: 'Scheduled', capacity: '10,000 L' },
  { id: 'ts-2', zone: 'West Delhi - Dwarka Sector 8 Slum Area', arrival: '08:00 AM & 05:00 PM', status: 'In Transit', capacity: '12,000 L' },
  { id: 'ts-3', zone: 'North East Delhi - Seelampur', arrival: '09:15 AM & 06:00 PM', status: 'Scheduled', capacity: '8,000 L' },
];

export const SAMPLE_HEAT_ZONES = [
  {
    id: 'hz-1', name: 'Central Delhi Thermal Corridor',
    bounds: [[28.61, 77.18], [28.67, 77.26]],
    risk: 'severe', riskLabel: 'Severe Heat Risk', code: '44°C+',
    color: 'var(--heat-severe)',
  },
  {
    id: 'hz-2', name: 'South Delhi Urban Heat Island',
    bounds: [[28.50, 77.18], [28.60, 77.27]],
    risk: 'high', riskLabel: 'High Heat Risk', code: '41°C–43°C',
    color: 'var(--heat-high)',
  },
  {
    id: 'hz-3', name: 'West Delhi Residential Zone',
    bounds: [[28.60, 77.05], [28.68, 77.16]],
    risk: 'moderate', riskLabel: 'Moderate Heat Risk', code: '38°C–40°C',
    color: 'var(--heat-moderate)',
  },
  {
    id: 'hz-4', name: 'North-East Yamuna Basin',
    bounds: [[28.68, 77.24], [28.76, 77.34]],
    risk: 'high', riskLabel: 'High Heat Risk', code: '41°C–43°C',
    color: 'var(--heat-high)',
  },
  {
    id: 'hz-5', name: 'Dwarka Green Buffer Zone',
    bounds: [[28.54, 77.02], [28.61, 77.10]],
    risk: 'low', riskLabel: 'Low Heat Risk', code: '35°C–37°C',
    color: 'var(--heat-low)',
  },
];

export const HEAT_RISK_SUMMARY = {
  level: 'High',
  levelCode: 'high',
  label: 'High Risk (42°C Feels Like)',
  tempActual: '39°C',
  tempFeelsLike: '42°C',
  uvIndex: '10 (Very High)',
  humidity: '48%',
  advisory: 'Limit direct outdoor exposure between 11:00 AM – 4:30 PM. Drink water every 20 minutes.',
  disclaimer: 'Sample data provided for hackathon demonstration. Not real-time meteorological advisories.',
};
