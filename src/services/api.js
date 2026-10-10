/**
 * api.js — Persisted Data & GIS Service
 * Uses browser localStorage for data persistence across reloads.
 * Connects to OpenStreetMap Nominatim API for free reverse geocoding.
 */

import { SAMPLE_REPORTS, SAMPLE_WATER_POINTS } from '../data/sampleData';

const STORAGE_KEY_REPORTS = 'heatshield_reports_v2';
const STORAGE_KEY_WATER_POINTS = 'heatshield_water_points_v2';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// Helper: Read from localStorage or seed with defaults
function getStoredReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(SAMPLE_REPORTS));
      return SAMPLE_REPORTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return SAMPLE_REPORTS;
  }
}

function saveReports(reports) {
  try {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports to localStorage:', e);
  }
}

function getStoredWaterPoints() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WATER_POINTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_WATER_POINTS, JSON.stringify(SAMPLE_WATER_POINTS));
      return SAMPLE_WATER_POINTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return SAMPLE_WATER_POINTS;
  }
}

function saveWaterPoints(waterPoints) {
  try {
    localStorage.setItem(STORAGE_KEY_WATER_POINTS, JSON.stringify(waterPoints));
  } catch (e) {
    console.error('Failed to save water points to localStorage:', e);
  }
}

/** Convert File object to Base64 string */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// ─── API Methods ─────────────────────────────────────────────────────────────

export async function fetchReports() {
  await delay(200);
  return getStoredReports();
}

export async function fetchWaterPoints() {
  await delay(200);
  return getStoredWaterPoints();
}

export async function submitReport({ issueType, description, lat, lng, photo, address }) {
  await delay(400);

  let photoUrl = null;
  if (photo) {
    try {
      photoUrl = await fileToBase64(photo);
    } catch (e) {
      console.warn('Could not encode photo:', e);
    }
  }

  // Attempt reverse geocoding if address not supplied
  let finalAddress = address || '';
  if (!finalAddress && lat && lng) {
    try {
      finalAddress = await reverseGeocode(lat, lng);
    } catch (e) {
      finalAddress = `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
    }
  }

  const reports = getStoredReports();
  const newReport = {
    id: `rpt-${Date.now()}`,
    issueType,
    description,
    address: finalAddress || 'Delhi Area',
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    photoUrl,
    status: 'open',
    upvotes: 1,
    officialNote: '',
    timestamp: new Date().toISOString(),
  };

  const updated = [newReport, ...reports];
  saveReports(updated);
  return newReport;
}

export async function updateReportStatus(id, status, officialNote = '') {
  await delay(200);
  const reports = getStoredReports();
  const updated = reports.map(r => {
    if (r.id === id) {
      return {
        ...r,
        status,
        officialNote: officialNote !== undefined ? officialNote : r.officialNote,
      };
    }
    return r;
  });
  saveReports(updated);
  return updated;
}

export async function upvoteReport(id) {
  await delay(100);
  const reports = getStoredReports();
  const updated = reports.map(r => {
    if (r.id === id) {
      return { ...r, upvotes: (r.upvotes || 0) + 1 };
    }
    return r;
  });
  saveReports(updated);
  return updated;
}

export async function deleteReport(id) {
  await delay(100);
  const reports = getStoredReports();
  const updated = reports.filter(r => r.id !== id);
  saveReports(updated);
  return updated;
}

export async function addWaterPoint({ name, type, lat, lng, status, address }) {
  await delay(200);
  const points = getStoredWaterPoints();
  const newPoint = {
    id: `wp-${Date.now()}`,
    name,
    type,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    status,
    address: address || 'Delhi',
  };
  const updated = [newPoint, ...points];
  saveWaterPoints(updated);
  return updated;
}

export async function updateWaterPointStatus(id, newStatus) {
  await delay(100);
  const points = getStoredWaterPoints();
  const updated = points.map(p => (p.id === id ? { ...p, status: newStatus } : p));
  saveWaterPoints(updated);
  return updated;
}

/** Nominatim OpenStreetMap Free Reverse Geocoding */
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
