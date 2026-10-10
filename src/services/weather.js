/**
 * WEATHER SERVICE — HeatShield
 * Fetches live weather from Open-Meteo API with caching & mock fallbacks.
 */

const WEATHER_CACHE = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * WMO Weather Interpretation Code Mapper
 */
export function mapWmoCode(code, isDay = 1) {
  if (code === 0) return { label: isDay ? 'Clear Sunny' : 'Clear Night', icon: isDay ? 'Sun' : 'Moon' };
  if ([1, 2, 3].includes(code)) return { label: 'Partly Cloudy', icon: 'CloudSun' };
  if ([45, 48].includes(code)) return { label: 'Hazy / Fog', icon: 'CloudFog' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { label: 'Rain / Showers', icon: 'CloudRain' };
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', icon: 'CloudLightning' };
  return { label: 'Clear', icon: isDay ? 'Sun' : 'Moon' };
}

/**
 * Calculate Heat Risk from Apparent ("Feels Like") Temperature
 * Lower: < 32°C
 * Moderate: 32 - 37°C
 * High: 38 - 41°C
 * Extreme: >= 42°C
 */
export function calculateHeatRisk(feelsLikeTemp) {
  if (feelsLikeTemp >= 42) {
    return {
      level: 'Extreme',
      badgeLabel: 'Extreme Heat Risk',
      color: '#F95738',
      bgColor: '#351C12',
      borderColor: '#F95738',
      advisoryBold: 'Dangerous heat right now. Stay indoors if you can.',
      advisoryText: 'Extreme heat warning. Sip water constantly, avoid sun exposure, and stay in cooled areas.',
    };
  }
  if (feelsLikeTemp >= 38) {
    return {
      level: 'High',
      badgeLabel: 'High Heat Risk',
      color: '#EE964B',
      bgColor: '#2B1B12',
      borderColor: '#EE964B',
      advisoryBold: "It's a hot afternoon. Take it a little easier.",
      advisoryText: 'Limit time in direct sun, drink water regularly, and take breaks somewhere cool.',
    };
  }
  if (feelsLikeTemp >= 32) {
    return {
      level: 'Moderate',
      badgeLabel: 'Moderate Heat Risk',
      color: '#F4D35E',
      bgColor: '#242111',
      borderColor: '#F4D35E',
      advisoryBold: 'Warm conditions outdoors. Stay hydrated.',
      advisoryText: 'Remember to carry a refillable water bottle and rest in shade when needed.',
    };
  }
  return {
    level: 'Lower',
    badgeLabel: 'Comfortable',
    color: '#6FD3B8',
    bgColor: 'rgba(111, 211, 184, 0.12)',
    borderColor: '#6FD3B8',
    advisoryBold: 'Pleasant weather in your area.',
    advisoryText: 'Good conditions outdoors. Keep drinking water as part of your daily routine.',
  };
}

/**
 * Fetch Live Weather from Open-Meteo
 */
export async function getLiveWeather(lat, lng) {
  const roundedLat = parseFloat(lat).toFixed(3);
  const roundedLng = parseFloat(lng).toFixed(3);
  const cacheKey = `${roundedLat},${roundedLng}`;

  // Check 10-min cache
  const cached = WEATHER_CACHE.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return { ...cached.data, isCached: true };
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${roundedLat}&longitude=${roundedLng}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day&hourly=temperature_2m,apparent_temperature,weather_code&timezone=auto&forecast_days=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const data = await res.json();

    const current = data.current;
    const tempActual = Math.round(current.temperature_2m);
    const tempFeelsLike = Math.round(current.apparent_temperature);
    const humidity = `${current.relative_humidity_2m}%`;
    const wmo = mapWmoCode(current.weather_code, current.is_day);
    const risk = calculateHeatRisk(tempFeelsLike);

    // Parse hourly forecast starting from current hour
    const hourlyRaw = data.hourly || {};
    const nowHour = new Date().getHours();
    const hourly = [];

    if (hourlyRaw.time && hourlyRaw.temperature_2m) {
      for (let i = 0; i < hourlyRaw.time.length && hourly.length < 7; i++) {
        const dateObj = new Date(hourlyRaw.time[i]);
        const hourNum = dateObj.getHours();

        if (hourNum >= nowHour || hourlyRaw.time.length <= 7) {
          const tAct = Math.round(hourlyRaw.temperature_2m[i]);
          const tApp = Math.round(hourlyRaw.apparent_temperature[i] || tAct);
          const hRisk = calculateHeatRisk(tApp);
          const displayTime = hourly.length === 0 ? 'Now' : `${hourNum % 12 || 12}${hourNum >= 12 ? 'pm' : 'am'}`;

          hourly.push({
            time: displayTime,
            temp: `${tAct}°`,
            feelsLike: `${tApp}°`,
            risk: hRisk.level,
            color: hRisk.color,
            active: hourly.length === 0,
          });
        }
      }
    }

    const payload = {
      isLive: true,
      tempActual,
      tempFeelsLike,
      humidity,
      condition: wmo.label,
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
      riskLevel: risk.badgeLabel,
      risk,
      hourly: hourly.length > 0 ? hourly : null,
      updatedAt: new Date(),
    };

    WEATHER_CACHE.set(cacheKey, { timestamp: Date.now(), data: payload });
    return payload;

  } catch (err) {
    console.warn('Open-Meteo live weather fetch failed, returning mock data:', err);

    // Fallback Mock
    return {
      isLive: false,
      isFallback: true,
      tempActual: 36,
      tempFeelsLike: 42,
      humidity: '62%',
      condition: 'Sunny',
      isDay: true,
      riskLevel: 'High Heat Risk',
      risk: calculateHeatRisk(42),
      hourly: null,
      updatedAt: new Date(),
      error: err.message,
    };
  }
}
