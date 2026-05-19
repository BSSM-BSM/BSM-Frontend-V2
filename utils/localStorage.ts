import { atomWithStorage } from "jotai/utils";

const storage = {
  getItem: (key: string, initialValue: any) => {
    if (typeof window === 'undefined') return initialValue;
    const rawValue = localStorage.getItem(key);
    if (rawValue === null) return initialValue;
    try {
      return JSON.parse(rawValue);
    } catch {
      return rawValue;
    }
  },
  setItem: (key: string, newValue: any) => {
    if (typeof window === 'undefined') return;
    if (newValue === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
  subscribe: (key: string, callback: () => void) => {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: StorageEvent) => {
      if (e.key === key) callback();
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
};

export const localStorageAtom = <T>(key: string, defaultValue: T) =>
  atomWithStorage<T>(key, defaultValue, storage as any);