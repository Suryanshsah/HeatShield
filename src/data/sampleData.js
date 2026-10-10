/**
 * SAMPLE DATA — Initial seed dataset for HeatShield Delhi.
 */

export const SAMPLE_WATER_POINTS = [
  { id: 'wp-1', name: 'Nehru Place Community Tap', lat: 28.5494, lng: 77.2510, status: 'operational', type: 'Community Tap', address: 'Nehru Place Bus Terminal, South Delhi' },
  { id: 'wp-2', name: 'Saket Water Kiosk',         lat: 28.5200, lng: 77.2100, status: 'low-supply',   type: 'Water Kiosk', address: 'Block C, Saket, New Delhi' },
  { id: 'wp-3', name: 'Lajpat Nagar Public Tap',   lat: 28.5700, lng: 77.2400, status: 'broken',       type: 'Public Tap', address: 'Central Market, Lajpat Nagar II' },
  { id: 'wp-4', name: 'Connaught Place Fountain',  lat: 28.6315, lng: 77.2167, status: 'operational', type: 'Fountain', address: 'Inner Circle, Block A, CP' },
  { id: 'wp-5', name: 'Karol Bagh Tanker Point',   lat: 28.6520, lng: 77.1900, status: 'operational', type: 'Tanker Point', address: 'Ajmal Khan Road, Karol Bagh' },
  { id: 'wp-6', name: 'Chandni Chowk Water Booth', lat: 28.6560, lng: 77.2310, status: 'low-supply',   type: 'Water Booth', address: 'Near Red Fort Metro Gate 1' },
  { id: 'wp-7', name: 'Dwarka Sec-10 Tap',         lat: 28.5730, lng: 77.0550, status: 'operational', type: 'Community Tap', address: 'Sector 10 DDA Market, Dwarka' },
  { id: 'wp-8', name: 'Rohini Sector 3 Kiosk',     lat: 28.7380, lng: 77.0740, status: 'broken',       type: 'Water Kiosk', address: 'Sector 3 Main Park, Rohini' },
];

export const SAMPLE_REPORTS = [
  {
    id: 'rpt-1',
    issueType: 'broken-tap',
    description: 'Tap at Lajpat Nagar bus stand is completely broken. Continuous water leak creating waste.',
    address: 'Lajpat Nagar Bus Stand, Ring Road',
    lat: 28.5700, lng: 77.2400,
    status: 'open',
    upvotes: 14,
    officialNote: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'rpt-2',
    issueType: 'water-unavailable',
    description: 'No water supply for the last 3 days in Saket Block C community tap.',
    address: 'Block C, Saket, South Delhi',
    lat: 28.5200, lng: 77.2100,
    status: 'acknowledged',
    upvotes: 28,
    officialNote: 'Delhi Jal Board tanker dispatched. Maintenance team investigating pipe pressure.',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'rpt-3',
    issueType: 'leaking-pipe',
    description: 'Underground main pipeline near Rohini Sector 3 park is leaking heavily onto main road.',
    address: 'Near Sector 3 Community Park, Rohini',
    lat: 28.7380, lng: 77.0740,
    status: 'open',
    upvotes: 9,
    officialNote: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
  },
  {
    id: 'rpt-4',
    issueType: 'cooling-unavailable',
    description: 'Public misting spray & cooling shelter at CP Metro Exit 4 is out of service.',
    address: 'Connaught Place Gate 4 Exit',
    lat: 28.6315, lng: 77.2167,
    status: 'resolved',
    upvotes: 5,
    officialNote: 'Pump repaired and cooling mist restored on 10th Oct.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'rpt-5',
    issueType: 'broken-tap',
    description: 'Chandni Chowk main water booth valve handle snapped off by crowd.',
    address: 'Chandni Chowk Chowk, Old Delhi',
    lat: 28.6560, lng: 77.2310,
    status: 'open',
    upvotes: 19,
    officialNote: '',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
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
  { id: 'hz-1', name: 'Central Delhi (UHI Zone)', bounds: [[28.62, 77.17], [28.67, 77.27]], risk: 'severe', colour: '#c1121f' },
  { id: 'hz-2', name: 'South Delhi Industrial Belt', bounds: [[28.50, 77.18], [28.60, 77.28]], risk: 'high', colour: '#e76f51' },
  { id: 'hz-3', name: 'West Delhi Residential Sector', bounds: [[28.60, 77.05], [28.68, 77.15]], risk: 'moderate', colour: '#f4a261' },
  { id: 'hz-4', name: 'North-East High Density Zone', bounds: [[28.68, 77.25], [28.76, 77.35]], risk: 'high', colour: '#e76f51' },
  { id: 'hz-5', name: 'Dwarka Greens Zone', bounds: [[28.54, 77.02], [28.61, 77.10]], risk: 'low', colour: '#52b788' },
];
