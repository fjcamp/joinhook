import type { GeoPoint, WeatherSnapshot } from './types';

const FALLBACK_LOCATION: GeoPoint = { lat: -41.3195, lng: -72.9854, label: 'Puerto Varas' };

export async function resolveLocation(): Promise<{ location: GeoPoint; permission: 'granted' | 'denied' | 'unavailable' }> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return { location: FALLBACK_LOCATION, permission: 'unavailable' };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'Tu ubicación',
        },
        permission: 'granted',
      }),
      () => resolve({ location: FALLBACK_LOCATION, permission: 'denied' }),
      { enableHighAccuracy: false, timeout: 6500, maximumAge: 10 * 60 * 1000 },
    );
  });
}

function weatherLabel(code: number): string {
  if (code === 0) return 'Despejado';
  if ([1, 2, 3].includes(code)) return 'Parcialmente nublado';
  if ([45, 48].includes(code)) return 'Niebla';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Llovizna';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Lluvia';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Nieve';
  if ([95, 96, 99].includes(code)) return 'Tormenta';
  return 'Condiciones variables';
}

function outdoorStatus(code: number, windKmh: number): string {
  if ([95, 96, 99].includes(code) || windKmh >= 55) return 'Precaución: condiciones adversas';
  if ([61, 63, 65, 66, 67, 71, 73, 75, 80, 81, 82, 85, 86].includes(code)) return 'Actividad exterior condicionada';
  return 'Apto para actividades exteriores';
}

export async function fetchWeather(location: GeoPoint): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(location.lat),
    longitude: String(location.lng),
    current: 'temperature_2m,weather_code,wind_speed_10m',
    timezone: 'auto',
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`weather_http_${response.status}`);
  const payload = await response.json() as {
    current?: { temperature_2m?: number; weather_code?: number; wind_speed_10m?: number; time?: string };
  };
  const current = payload.current;
  if (!current || typeof current.temperature_2m !== 'number' || typeof current.weather_code !== 'number') {
    throw new Error('weather_payload_invalid');
  }
  const wind = typeof current.wind_speed_10m === 'number' ? current.wind_speed_10m : 0;
  return {
    temperatureC: Math.round(current.temperature_2m),
    condition: weatherLabel(current.weather_code),
    outdoorStatus: outdoorStatus(current.weather_code, wind),
    observedAt: current.time ?? new Date().toISOString(),
    source: 'Open-Meteo',
    windKmh: Math.round(wind),
  };
}
