import { HOURLY_FORECAST, MOCK_PLACES, MOCK_REPORTS } from '../data/mockData';
import { calculateHaversineDistance, calculateWalkTime, WATER_POINTS_DATA } from '../data/waterPoints';

const API_BASE = import.meta.env.VITE_API_URL || '';

// Internal local memory state for session mutations
let localReports = [...MOCK_REPORTS];
let localPlaces  = [...MOCK_PLACES];
let localWaterPoints = [...WATER_POINTS_DATA];

/**
 * Fetch local heat conditions & hourly forecast
 */
export async function getConditions() {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/conditions`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('AWS API unreachable, using local conditions mock:', e);
    }
  }

  return {
    location: 'Park Street, Delhi',
    tempActual: 36,
    tempFeelsLike: 42,
    humidity: '62%',
    condition: 'Sunny',
    riskLevel: 'High heat risk',
    advisoryBold: "It's a hot afternoon. Take it a little easier.",
    advisoryText: 'Limit time in direct sun, drink water regularly, and take breaks somewhere cool.',
    hourly: HOURLY_FORECAST,
  };
}

/**
 * Fetch nearby cooling and water places
 */
export async function getPlaces() {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/places`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('AWS API unreachable, using local places mock:', e);
    }
  }

  return localPlaces;
}

/**
 * Fetch Water Points with Distance & Report Reactions
 */
export async function getWaterPoints(userLat = 28.6139, userLng = 77.2090, radiusMeters = 200000) {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/water-points?lat=${userLat}&lng=${userLng}&radius=${radiusMeters}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('AWS API unreachable, using local water points mock:', e);
    }
  }

  // Calculate distance, walk time, and report reactions for each water point
  const processed = localWaterPoints.map((wp) => {
    const distMeters = calculateHaversineDistance(userLat, userLng, wp.lat, wp.lng);
    const walkTime = calculateWalkTime(distMeters);

    // Check if any recent active report is within 100 meters of this water point
    let activeStatus = wp.status;
    let reportedByNeighbours = false;

    const nearbyReport = localReports.find((r) => {
      if (r.status === 'resolved') return false;
      const reportDist = calculateHaversineDistance(wp.lat, wp.lng, r.lat, r.lng);
      return reportDist <= 100 && (r.issueType === 'no-water' || r.issueType === 'broken-tap' || r.issueType === 'dirty-water');
    });

    if (nearbyReport) {
      reportedByNeighbours = true;
      if (nearbyReport.issueType === 'no-water' || nearbyReport.issueType === 'broken-tap') {
        activeStatus = 'Not working';
      } else if (nearbyReport.issueType === 'dirty-water') {
        activeStatus = 'Low flow';
      }
    }

    // Humanized "last confirmed"
    const minutesAgo = Math.round((Date.now() - new Date(wp.lastConfirmed || Date.now()).getTime()) / (1000 * 60));
    const timeAgoLabel = minutesAgo < 1 ? 'Just now' : `${minutesAgo} min ago`;

    return {
      ...wp,
      status: activeStatus,
      distanceMeters: distMeters,
      distanceLabel: distMeters >= 1000 ? `${(distMeters / 1000).toFixed(1)} km` : `${distMeters} m`,
      walkTime,
      reportedByNeighbours,
      timeAgoLabel,
    };
  });

  // Filter within radius & sort by nearest distance
  const inRadius = processed.filter(wp => wp.distanceMeters <= radiusMeters);
  inRadius.sort((a, b) => a.distanceMeters - b.distanceMeters);

  return inRadius;
}

export const fetchWaterPoints = getWaterPoints;

/**
 * Confirm/Update Water Point Status (Quick Action)
 */
export async function confirmWaterPointStatus(waterPointId, newStatus) {
  const target = localWaterPoints.find(w => w.id === waterPointId);
  if (target) {
    target.status = newStatus;
    target.confirmations = (target.confirmations || 0) + 1;
    target.lastConfirmed = new Date().toISOString();
  }

  if (API_BASE) {
    try {
      await fetch(`${API_BASE}/water-points/${waterPointId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.warn('AWS confirm water point status failed:', e);
    }
  }

  return target;
}

export async function updateWaterPointStatus(id, newStatus) {
  return confirmWaterPointStatus(id, newStatus);
}

export async function addWaterPoint({ name, type, lat, lng, status, address }) {
  const newPoint = {
    id: `wp-${Date.now()}`,
    name,
    type,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    status: status || 'operational',
    address: address || 'Delhi',
    lastConfirmed: new Date().toISOString(),
  };
  localWaterPoints.unshift(newPoint);
  return localWaterPoints;
}

/**
 * Fetch community incident reports
 */
export async function getReports() {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/reports`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('AWS API unreachable, using local reports mock:', e);
    }
  }

  return localReports;
}

export const fetchReports = getReports;

/**
 * Submit a new community report
 */
export async function submitReport(reportData) {
  const newId = `HS-${Math.floor(1000 + Math.random() * 9000)}`;

  const newReport = {
    id: newId,
    category: reportData.category || 'water',
    issueType: reportData.issueType || 'broken-tap',
    title: reportData.title || reportData.description || 'Community reported issue',
    locationName: reportData.locationName || reportData.address || 'Delhi Neighbourhood',
    address: reportData.address || reportData.locationName || 'Delhi Neighbourhood',
    lat: parseFloat(reportData.lat || 28.6139),
    lng: parseFloat(reportData.lng || 77.2090),
    urgency: reportData.urgency || 'serious',
    urgencyLabel: reportData.urgency === 'urgent' ? 'Urgent' : reportData.urgency === 'minor' ? 'Minor' : 'Serious',
    status: 'open',
    statusLabel: 'Open',
    timeAgo: 'Just now',
    timestamp: new Date().toISOString(),
    confirmations: 1,
    upvotes: 1,
    description: reportData.description || '',
    photo: reportData.photo || null,
    officialNote: '',
    _mock: !API_BASE,
  };

  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
      });
      if (res.ok) {
        const saved = await res.json();
        localReports.unshift(saved);
        return saved;
      }
    } catch (e) {
      console.warn('AWS API post failed, storing locally:', e);
    }
  }

  localReports.unshift(newReport);
  return newReport;
}

export async function updateReportStatus(id, newStatus, officialNote = '') {
  const target = localReports.find(r => r.id === id);
  if (target) {
    target.status = newStatus;
    target.statusLabel = newStatus.toUpperCase();
    if (officialNote !== undefined) target.officialNote = officialNote;
  }
  return localReports;
}

export async function deleteReport(id) {
  localReports = localReports.filter(r => r.id !== id);
  return localReports;
}

/**
 * Increment "I see this too" confirmation count on a report
 */
export async function confirmReport(reportId) {
  const target = localReports.find(r => r.id === reportId);
  if (target) {
    target.confirmations = (target.confirmations || 0) + 1;
    target.upvotes = (target.upvotes || 0) + 1;
  }

  if (API_BASE) {
    try {
      await fetch(`${API_BASE}/reports/${reportId}/confirm`, { method: 'POST' });
    } catch (e) {
      console.warn('AWS confirm endpoint fallback:', e);
    }
  }

  return target ? target.confirmations : 1;
}

export const upvoteReport = confirmReport;

export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`);
    if (!res.ok) return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
    const data = await res.json();
    if (data && data.display_name) {
      const parts = data.display_name.split(',');
      return parts.slice(0, 3).join(', ');
    }
    return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
  } catch (e) {
    return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
  }
}
