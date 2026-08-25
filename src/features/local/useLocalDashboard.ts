import { useCallback, useEffect, useState } from 'react';
import { localDataGateway } from './services';
import { fetchWeather, resolveLocation } from './live';
import { readCachedDashboard, writeCachedDashboard } from './storage';
import type { LocalDashboard, RuntimeState } from './types';

export function useLocalDashboard() {
  const [dashboard, setDashboard] = useState<LocalDashboard | null>(null);
  const [runtime, setRuntime] = useState<RuntimeState>({
    status: 'loading',
    online: true,
    locationPermission: 'unknown',
    lastUpdated: null,
  });

  const load = useCallback(async () => {
    const cached = readCachedDashboard();
    if (cached) {
      setDashboard(cached);
      setRuntime((state) => ({ ...state, status: 'stale', lastUpdated: cached.updatedAt ?? cached.weather.observedAt }));
    } else {
      setRuntime((state) => ({ ...state, status: 'loading' }));
    }

    try {
      const base = await localDataGateway.getDashboard();
      const { location, permission } = await resolveLocation();
      let weather = base.weather;
      let status: RuntimeState['status'] = 'ready';

      try {
        weather = await fetchWeather(location);
      } catch {
        status = cached ? 'stale' : 'degraded';
      }

      const next: LocalDashboard = {
        ...base,
        location,
        weather,
        updatedAt: new Date().toISOString(),
      };
      setDashboard(next);
      writeCachedDashboard(next);
      setRuntime({
        status,
        online: typeof navigator === 'undefined' ? true : navigator.onLine,
        locationPermission: permission,
        lastUpdated: next.updatedAt,
      });
    } catch {
      setRuntime((state) => ({ ...state, status: cached ? 'stale' : 'error' }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const sync = () => setRuntime((state) => ({ ...state, online: navigator.onLine }));
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);

  return { dashboard, runtime, refresh: load };
}
