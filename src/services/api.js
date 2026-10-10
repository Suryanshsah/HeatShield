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
export async function getWaterPoints(userLat = 28.6139, userLng = 77.2090, radiusMeters = 2000) {
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

    // Check if any recent active report is within 50 meters of this water point
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
    const minutesAgo = Math.round((Date.now() - new Date(wp.lastConfirmed).getTime()) / (1000 * 60));
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

/**
 * Submit a new community report (also triggers water point status reaction!)
 */
export async function submitReport(reportData) {
  const newId = `HS-${Math.floor(1000 + Math.random() * 9000)}`;

  const newReport = {
    id: newId,
    category: reportData.category || 'water',
    issueType: reportData.issueType || 'broken-tap',
    title: reportData.title || reportData.description || 'Community reported issue',
    locationName: reportData.locationName || 'Delhi Neighbourhood',
    lat: reportData.lat || 28.6139,
    lng: reportData.lng || 77.2090,
    urgency: reportData.urgency || 'serious',
    urgencyLabel: reportData.urgency === 'urgent' ? 'Urgent' : reportData.urgency === 'minor' ? 'Minor' : 'Serious',
    status: 'new',
    statusLabel: 'New',
    timeAgo: 'Just now',
    timestamp: new Date().toISOString(),
    confirmations: 1,
    description: reportData.description || '',
    photo: reportData.photo || null,
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

/**
 * Increment "I see this too" confirmation count on a report
 */
export async function confirmReport(reportId) {
  const target = localReports.find(r => r.id === reportId);
  if (target) {
    target.confirmations = (target.confirmations || 0) + 1;
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
