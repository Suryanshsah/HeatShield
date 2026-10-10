/**
 * api.js — HeatShield API service
 *
 * Reads VITE_API_URL from the environment.
 * When the variable is absent the functions return mock data so the UI
 * works locally without any AWS infrastructure.
 *
 * DO NOT hardcode credentials or AWS secrets here.
 */

import { SAMPLE_REPORTS, SAMPLE_WATER_POINTS } from '../data/sampleData';

const BASE_URL = import.meta.env.VITE_API_URL || null;

// Simulate network latency in dev/mock mode
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// ─── Reports ──────────────────────────────────────────────────────────────────

/**
 * Fetch all incident reports.
 * @returns {Promise<Array>}
 */
export async function fetchReports() {
  if (!BASE_URL) {
    await delay();
    return [...SAMPLE_REPORTS];
  }
  const res = await fetch(`${BASE_URL}/reports`);
  if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`);
  return res.json();
}

// ─── Water Points ─────────────────────────────────────────────────────────────

/**
 * Fetch all water-point locations.
 * @returns {Promise<Array>}
 */
export async function fetchWaterPoints() {
  if (!BASE_URL) {
    await delay();
    return [...SAMPLE_WATER_POINTS];
  }
  const res = await fetch(`${BASE_URL}/water-points`);
  if (!res.ok) throw new Error(`Failed to fetch water points: ${res.status}`);
  return res.json();
}

// ─── Submit Report ────────────────────────────────────────────────────────────

/**
 * Submit a new incident report.
 * @param {Object} payload
 * @param {string} payload.issueType
 * @param {string} payload.description
 * @param {number} payload.lat
 * @param {number} payload.lng
 * @param {File|null} [payload.photo]
 * @returns {Promise<Object>} The saved report object (or a mock ack)
 */
export async function submitReport({ issueType, description, lat, lng, photo }) {
  if (!BASE_URL) {
    await delay(600);
    const newReport = {
      id: `rpt-${Date.now()}`,
      issueType,
      description,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      status: 'open',
      timestamp: new Date().toISOString(),
      _mock: true,
    };
    return newReport;
  }

  // Real submission — multipart if photo is attached, JSON otherwise
  if (photo) {
    const form = new FormData();
    form.append('issueType', issueType);
    form.append('description', description);
    form.append('lat', lat);
    form.append('lng', lng);
    form.append('photo', photo);
    const res = await fetch(`${BASE_URL}/reports`, { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
    return res.json();
  }

  const res = await fetch(`${BASE_URL}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issueType, description, lat, lng }),
  });
  if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
  return res.json();
}
