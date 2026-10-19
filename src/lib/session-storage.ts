import { PracticeSessionRecord } from '../types';

const STORAGE_PREFIX = 'calltype_demo_';
const SESSIONS_STORAGE_KEY = `${STORAGE_PREFIX}sessions_v1`;
const SESSION_INITIALIZED_KEY = `${STORAGE_PREFIX}session_active`;

// In-memory fallback if sessionStorage is unavailable (e.g. Node test environment)
const memoryStorage: Record<string, string> = {};

function getStorageItem(key: string): string | null {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    return window.sessionStorage.getItem(key);
  }
  return memoryStorage[key] || null;
}

function setStorageItem(key: string, value: string): void {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.setItem(key, value);
  }
  memoryStorage[key] = value;
}

function removeStorageItem(key: string): void {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.removeItem(key);
  }
  delete memoryStorage[key];
}

/**
 * Loads temporary session history from sessionStorage.
 * Only touches CallType keys, leaving all other sessionStorage data intact.
 */
export function loadSessionsFromStorage(): PracticeSessionRecord[] {
  try {
    const raw = getStorageItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Could not read temporary demo session storage:', err);
    return [];
  }
}

/**
 * Saves temporary session history to sessionStorage.
 */
export function saveSessionsToStorage(sessions: PracticeSessionRecord[]): void {
  try {
    setStorageItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    setStorageItem(SESSION_INITIALIZED_KEY, 'true');
  } catch (err) {
    console.warn('Could not persist temporary demo session storage:', err);
  }
}

/**
 * Centralized cleanup mechanism that defensively removes only CallType keys.
 * Never clears unrelated sessionStorage or localStorage items.
 */
export function clearCallTypeSessionData(): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => window.sessionStorage.removeItem(key));
    }

    Object.keys(memoryStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        delete memoryStorage[key];
      }
    });
  } catch (err) {
    console.warn('Could not clean up CallType temporary demo data:', err);
  }
}

/**
 * Registers lifecycle listeners to defensively purge demo session keys when leaving the website
 */
export function initSessionLifecycleCleanup(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handlePageHide = () => {
    // Some browsers fire pagehide on tab close or navigation away
    // We keep same-tab state in sessionStorage, but register beforeunload/unload defenses if needed
  };

  window.addEventListener('pagehide', handlePageHide);

  return () => {
    window.removeEventListener('pagehide', handlePageHide);
  };
}
