/**
 * weatherApi.js — Fetches live weather for Delhi (28.6139, 77.2090)
 * using the free Open-Meteo API (no API key required).
 */

const DELHI_LAT = 28.6139;
const DELHI_LNG = 77.2090;

export async function fetchLiveDelhiWeather() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${DELHI_LAT}&longitude=${DELHI_LNG}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
    
    const data = await res.json();
    const current = data.current;

    const temp = Math.round(current.temperature_2m);
    const feelsLike = Math.round(current.apparent_temperature);
    const humidity = Math.round(current.relative_humidity_2m);
    const windSpeed = Math.round(current.wind_speed_10m);

    // Dynamic Heat Risk Calculation
    let level = 'Low';
    let advisory = 'Normal summer conditions. Stay hydrated when stepping outdoors.';
    let accent = '#52b788';
    let bg = '#e8f7ef';

    if (feelsLike >= 44) {
      level = 'Severe';
      advisory = '🚨 SEVERE HEATWAVE WARNING: Avoid direct sun exposure 11 AM - 5 PM. High risk of heat stroke. Drink water frequently.';
      accent = '#c1121f';
      bg = '#fde8e8';
    } else if (feelsLike >= 38) {
      level = 'High';
      advisory = '⚠️ HIGH HEAT RISK: Limit strenuous outdoor activity. Carry water bottles and seek shaded cooling spots.';
      accent = '#e76f51';
      bg = '#fdeee9';
    } else if (feelsLike >= 32) {
      level = 'Moderate';
      advisory = '☀️ MODERATE HEAT: Warm conditions expected. Keep hydrating and check community water points.';
      accent = '#f4a261';
      bg = '#fef3e6';
    }

    return {
      temp: `${temp} °C`,
      feelsLike: `${feelsLike} °C`,
      feelsLikeNum: feelsLike,
      humidity: `${humidity}%`,
      windSpeed: `${windSpeed} km/h`,
      level,
      advisory,
      accent,
      bg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLive: true,
    };
  } catch (err) {
    console.warn('Using offline weather fallback:', err);
    return {
      temp: '39 °C',
      feelsLike: '42 °C',
      feelsLikeNum: 42,
      humidity: '48%',
      windSpeed: '12 km/h',
      level: 'High',
      advisory: '⚠️ HIGH HEAT RISK (Offline): Limit outdoor activity between 11 am – 5 pm. Carry water at all times.',
      accent: '#e76f51',
      bg: '#fdeee9',
      timestamp: 'Offline',
      isLive: false,
    };
  }
}
