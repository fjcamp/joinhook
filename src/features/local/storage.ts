import type { LocalDashboard } from './types';

const DASHBOARD_KEY = 'joinhook.local.dashboard.v1';
const SAVED_KEY = 'joinhook.local.saved.v1';

export function readCachedDashboard(): LocalDashboard | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DASHBOARD_KEY);
    return raw ? (JSON.parse(raw) as LocalDashboard) : null;
  } catch {
    return null;
  }
}

export function writeCachedDashboard(value: LocalDashboard): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DASHBOARD_KEY, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private/restricted contexts.
  }
}

export function readSavedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function toggleSavedId(id: string): string[] {
  const current = new Set(readSavedIds());
  current.has(id) ? current.delete(id) : current.add(id);
  const next = [...current];
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch {
      // Non-fatal: the UI still works for the current session.
    }
  }
  return next;
}
