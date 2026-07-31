/**
 * Persistence seam.
 *
 * Everything the app knows about a run lives in one serializable object. Today
 * that lands in localStorage; when this moves to Firebase, only this file
 * changes. Nothing else in the app should know where state is stored.
 */

export interface PersistenceAdapter {
  load<T>(key: string): T | null;
  save<T>(key: string, value: T): void;
  clear(key: string): void;
}

export const localAdapter: PersistenceAdapter = {
  load(key) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  save(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private mode — a lost run is not worth crashing over */
    }
  },
  clear(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

export let adapter: PersistenceAdapter = localAdapter;

export function setAdapter(next: PersistenceAdapter) {
  adapter = next;
}
